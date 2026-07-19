import { mkdir, writeFile } from "node:fs/promises";

const outputDirectory = new URL("../dist/server/", import.meta.url);
const outputFile = new URL("index.js", outputDirectory);

const worker = `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || request.method !== "GET") {
      return response;
    }

    const acceptsHtml = request.headers.get("accept")?.includes("text/html");
    if (!acceptsHtml) {
      return response;
    }

    const indexUrl = new URL("/index.html", request.url);
    return env.ASSETS.fetch(new Request(indexUrl, request));
  },
};

export default worker;
`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputFile, worker, "utf8");

console.log("Generated Cloudflare Worker entry point.");
