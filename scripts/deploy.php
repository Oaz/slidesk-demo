<?php
/**
 * SliDesk deploy endpoint
 *
 * Usage: GET/POST /deploy.php?token=<DEPLOY_TOKEN>
 * Response: plain text, HTTP 200 on success, 500 on failure. Never cached.
 *
 * All configuration lives in an .env file (see ENV_FILE below), which must be
 * stored OUTSIDE the web root so it is never served to visitors.
 *
 * Required .env keys:
 *   BIN_PATH        base dir containing .bun/bin
 *   SOURCE_PATH     repo synced by the GitHub Action
 *   DEST_PATH       web root served by your server
 *   BUILD_PATH      exact path passed to `slidesk save -t`
 *   DEPLOY_TOKEN    the secret token to authorize a deploy
 *   ADMIN_PASSWORD  keypad admin password injected into the built slidesk.js
 *   API_URL         keypad API base injected into the built slidesk.js
 *                   (the deck fetches `${API_URL}/pad/<endpoint>`)
 * Optional:
 *   LOG_FILE        log file path (default: /tmp/slidesk-deploy.log)
 *   ENV_FILE        can also be set via the environment to relocate the .env
 */

declare(strict_types=1);

// ---------------------------------------------------------------------------
// Configuration: location of the .env file
// ---------------------------------------------------------------------------
const ENV_FILE = '/home/.../.env'; // e.g. outside the web root

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadEnv(string $envFile): array {
    if (!is_readable($envFile)) {
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        die("ERROR: env file not readable: $envFile\n");
    }
    $env = [];
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        $env['@error'] = 'unreadable';
        return $env;
    }
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) {
            continue;
        }
        [$key, $value] = array_pad(explode('=', $line, 2), 2, '');
        $key = trim($key);
        $value = trim($value);
        // strip surrounding quotes
        if (strlen($value) >= 2 && (
            (str_starts_with($value, '"') && str_ends_with($value, '"'))
            || (str_starts_with($value, "'") && str_ends_with($value, "'"))
        )) {
            $value = substr($value, 1, -1);
        }
        if ($key !== '') {
            $env[$key] = $value;
        }
    }
    return $env;
}

function env(array $env, string $key, ?string $default = null): string {
    $value = getenv($key);
    if ($value === false) {
        $value = $env[$key] ?? $default;
    }
    return (string)$value;
}

function respond(int $status, string $message): never {
    // Anti-caching headers: each browser call must reach the server
    http_response_code($status);
    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0, private');
    header('Pragma: no-cache');
    header('Expires: ' . gmdate('D, d M Y H:i:s', 0) . ' GMT');
    // Unique body so no intermediary ever serves a stale copy
    echo $message . "\n[" . uniqid('deploy-', true) . "]\n";
    exit($status === 200 ? 0 : 1);
}

function run(string $command, array &$output): int {
    exec($command . ' 2>&1', $out, $ret);
    $output = array_merge($output, $out);
    return $ret;
}

/**
 * Inject the deployment keypad values into the generated slidesk.js.
 *
 * `slidesk save` embeds slidesk.toml into slidesk.js (window.slidesk.env),
 * including the repo's placeholder ADMIN_PASSWORD / API_URL. This replaces
 * them with the values from the .env, inside BUILD_PATH only: the synced
 * source tree is never touched, and the patch happens before the rsync.
 *
 * A missing file, keypad object, or key fails the deploy loudly: a format
 * change in slidesk must never silently ship the placeholder values.
 */
function patchKeypadEnv(string $file, string $adminPassword, string $apiUrl): void {
    $js = file_get_contents($file);
    if ($js === false) {
        throw new RuntimeException("cannot read generated slidesk.js: $file");
    }
    // The keypad env object only holds scalar values, so [^{}]* stays inside it.
    if (!preg_match('/"keypad"\s*:\s*\{[^{}]*\}/', $js, $m)) {
        throw new RuntimeException('keypad env object not found in slidesk.js');
    }
    $patched = $m[0];
    foreach (['ADMIN_PASSWORD' => $adminPassword, 'API_URL' => $apiUrl] as $key => $value) {
        // json_encode produces a safely quoted JS/JSON string
        $encoded = json_encode($value, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($encoded === false) {
            throw new RuntimeException("cannot safely encode keypad value for $key");
        }
        $patched = preg_replace_callback(
            '/("' . preg_quote($key, '/') . '"\s*:\s*)"(?:[^"\\\\]|\\\\.)*"/',
            static fn(array $mm): string => $mm[1] . $encoded,
            $patched,
            1,
            $count
        );
        if ($count !== 1) {
            throw new RuntimeException("keypad key $key not found in slidesk.js env");
        }
    }
    if (file_put_contents($file, str_replace($m[0], $patched, $js)) === false) {
        throw new RuntimeException("cannot write back generated slidesk.js: $file");
    }
}

// ---------------------------------------------------------------------------
// Load configuration
// ---------------------------------------------------------------------------
$env = loadEnv(getenv('ENV_FILE') ?: ENV_FILE);

$BIN_PATH       = env($env, 'BIN_PATH');
$SOURCE_PATH    = env($env, 'SOURCE_PATH');
$DEST_PATH      = env($env, 'DEST_PATH');
$BUILD_PATH     = env($env, 'BUILD_PATH');
$DEPLOY_TOKEN   = env($env, 'DEPLOY_TOKEN');
$ADMIN_PASSWORD = env($env, 'ADMIN_PASSWORD');
$API_URL        = env($env, 'API_URL');
$LOG_FILE       = env($env, 'LOG_FILE', '/tmp/slidesk-deploy.log');

$missing = [];
foreach (['BIN_PATH' => $BIN_PATH, 'SOURCE_PATH' => $SOURCE_PATH, 'DEST_PATH' => $DEST_PATH, 'BUILD_PATH' => $BUILD_PATH, 'DEPLOY_TOKEN' => $DEPLOY_TOKEN, 'ADMIN_PASSWORD' => $ADMIN_PASSWORD, 'API_URL' => $API_URL] as $name => $value) {
    if ($value === '') {
        $missing[] = $name;
    }
}
if ($missing) {
    respond(500, 'ERROR: missing configuration in env file: ' . implode(', ', $missing));
}

// ---------------------------------------------------------------------------
// Auth: require the token via query param or header
// ---------------------------------------------------------------------------
$token = $_GET['token'] ?? '';
if ($token === '' && isset($_SERVER['HTTP_X_DEPLOY_TOKEN'])) {
    $token = $_SERVER['HTTP_X_DEPLOY_TOKEN'];
}
if (!hash_equals($DEPLOY_TOKEN, (string)$token)) {
    sleep(1);
    respond(403, 'Forbidden: invalid or missing token.');
}

// ---------------------------------------------------------------------------
// Guard: one deploy at a time
// ---------------------------------------------------------------------------
$lock = fopen('/tmp/slidesk-deploy.lock', 'c');
if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
    respond(429, 'A deploy is already in progress. Try again shortly.');
}

$log = static fn(string $line) => error_log(sprintf('[%s] %s', date('c'), $line) . "\n", 3, $LOG_FILE);
$startTime = microtime(true);
$log("Deploy started from {$_SERVER['REMOTE_ADDR']}");

// ---------------------------------------------------------------------------
// Build with SliDesk into BUILD_PATH (exact target dir, always cleaned first)
// ---------------------------------------------------------------------------
exec(sprintf('rm -rf %s', escapeshellarg($BUILD_PATH)));
if (!mkdir($BUILD_PATH, 0755, true)) {
    $log("ERROR: cannot create $BUILD_PATH");
    respond(500, "ERROR: cannot create $BUILD_PATH");
}

$bun     = $BIN_PATH . '/.bun/bin/bun';
$slidesk = $BIN_PATH . '/.bun/bin/slidesk';
$output  = [];

try {
    if (!is_dir($SOURCE_PATH)) {
        throw new RuntimeException("Source path does not exist: $SOURCE_PATH");
    }

    // Build: -t is the exact output path
    $ret = run(sprintf(
        '%s %s save -t %s %s',
        escapeshellarg($bun), escapeshellarg($slidesk),
        escapeshellarg($BUILD_PATH), escapeshellarg($SOURCE_PATH)
    ), $output);
    if ($ret !== 0) {
        throw new RuntimeException("slidesk save failed (exit $ret)");
    }
    if (!is_dir($BUILD_PATH) || !glob($BUILD_PATH . '/*')) {
        throw new RuntimeException("Build output is empty at $BUILD_PATH");
    }

    // Keypad: override the slidesk.toml placeholders in the built slidesk.js
    patchKeypadEnv($BUILD_PATH . '/slidesk.js', $ADMIN_PASSWORD, $API_URL);
    $output[] = 'slidesk.js: keypad ADMIN_PASSWORD and API_URL overridden from env';
    $log('slidesk.js keypad env patched (ADMIN_PASSWORD, API_URL)');

    // Deploy: -a only, NO --delete, existing server files are untouched
    $ret = run(sprintf(
        'rsync -a %s/ %s',
        escapeshellarg($BUILD_PATH), escapeshellarg($DEST_PATH)
    ), $output);
    if ($ret !== 0) {
        throw new RuntimeException("rsync failed (exit $ret)");
    }

    $duration = round(microtime(true) - $startTime, 1);
    $log("Deploy OK in {$duration}s");
    respond(200, "Deploy OK in {$duration}s\n" . implode("\n", $output));
} catch (Throwable $e) {
    $log('ERROR: ' . $e->getMessage());
    respond(500, "Deploy FAILED: " . $e->getMessage() . "\n" . implode("\n", $output));
} finally {
    exec(sprintf('rm -rf %s', escapeshellarg($BUILD_PATH)));
    flock($lock, LOCK_UN);
    fclose($lock);
}
