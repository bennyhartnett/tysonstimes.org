import { mkdir, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/server/", import.meta.url);
const outputFile = new URL("index.js", outputDirectory);

const worker = `const SECURITY_HEADERS = {
  "content-security-policy": "default-src 'self'; base-uri 'self'; connect-src 'self' https://api.open-meteo.com https://content.tysonstimes.org; font-src 'self'; form-action 'self' https://github.com; frame-ancestors 'none'; img-src 'self' data: https://content.tysonstimes.org; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; upgrade-insecure-requests",
  "permissions-policy": "camera=(), geolocation=(), microphone=()",
  "referrer-policy": "strict-origin-when-cross-origin",
  "strict-transport-security": "max-age=31536000; includeSubDomains",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
};

function secure(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || request.method !== "GET") {
      return secure(response);
    }

    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    if (!acceptsHtml) {
      return secure(response);
    }

    const indexUrl = new URL("/index.html", request.url);
    return secure(await env.ASSETS.fetch(new Request(indexUrl, request)));
  },
};

export default worker;
`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, worker, "utf8");

console.log("Generated Cloudflare Worker entry point.");
