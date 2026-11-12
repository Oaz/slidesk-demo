const PREFIX = "/relay";

export default async (req, env) => {
  const url = new URL(req.url);
  if (!url.pathname.startsWith(PREFIX + "/")) return null; // not our route

  const target = env.keypad.TARGET + url.pathname.slice(PREFIX.length) + url.search;
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const upstream = await fetch(target, {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.arrayBuffer(),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "content-type": upstream.headers.get("content-type") ?? "application/json",
    },
  });
};
