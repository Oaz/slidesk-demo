
async function postJSON(endpoint, payload, errorLabel) {
  const keypadEnv = window.slidesk.env.keypad;

  try {
    const response = await fetch(`${keypadEnv.API_URL}/pad/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: keypadEnv.ADMIN_PASSWORD, ...payload }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error in ${errorLabel}:`, error);
  }
}

async function defineAlias(keypadName, keys, limit = false) {
  const payload = {
    action: 'alias',
    alias: 'cdl',
    kb: keypadName,
    keys,
  };
  if (limit !== false) {
    payload.limit = limit;
  }
  return postJSON('alias.php', payload, 'alias definition');
}

async function waitKeys(keypadName) {
  return defineAlias(keypadName, '⏳');
}

async function cursorKeys(keypadName) {
  return defineAlias(keypadName, ',↑,,←,,→,,↓,');
}

async function multiChoicePad(keypadName, choices) {
  const labels = Array.from({ length: choices }, (_, i) => String.fromCharCode(65 + i)).join(',');
  return defineAlias(keypadName, labels, choices);
}

async function numericPad(keypadName, limit) {
  return defineAlias(keypadName, ',1,4,7,0,2,5,8,,3,6,9', limit);
}

async function probe(keypadName, init, program) {
  return postJSON('probe.php', {
    kb: keypadName,
    init,
    program,
  }, 'probe');
}

async function countUsers(keypadName) {
  return probe(keypadName, '1', 'v');
}

async function cursorMovement(keypadName) {
  return probe(keypadName, '500500', `
if(k == key "←", if(v / 1000 > 0, v - 1000, v),
if(k == key "→", if(v / 1000 < 999, v + 1000, v),
if(k == key "↑", if(v % 1000 > 0, v - 1, v),
                 if(v % 1000 < 999, v + 1, v))))`);
}

async function pressedKeys(keypadName) {
  return probe(keypadName, '0', `if(k >= 0, v | (1 << k), v)`);
}

async function resultingInteger(keypadName) {
  return probe(keypadName, '0', `
if(k == key "1", v * 10 + 1,
if(k == key "4", v * 10 + 4,
if(k == key "7", v * 10 + 7,
if(k == key "0", v * 10 + 0,
if(k == key "2", v * 10 + 2,
if(k == key "5", v * 10 + 5,
if(k == key "8", v * 10 + 8,
if(k == key "3", v * 10 + 3,
if(k == key "6", v * 10 + 6,
if(k == key "9", v * 10 + 9,
v))))))))))`);
}
