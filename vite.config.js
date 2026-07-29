import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { DEFAULT_OPERATIONS_SETTINGS, normalizeOperationsSettings } from "./src/config/operationsSettings.js";

function localOperationsSettings() {
  const settingsPath = path.resolve(".cache", "operations-settings.json");

  function sendJson(response, status, value) {
    response.statusCode = status;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.setHeader("cache-control", "no-store");
    response.end(JSON.stringify(value));
  }

  return {
    name: "local-operations-settings",
    configureServer(server) {
      server.middlewares.use("/__operations/settings", async (request, response) => {
        if (request.method === "GET") {
          try {
            const saved = JSON.parse(await readFile(settingsPath, "utf8"));
            sendJson(response, 200, normalizeOperationsSettings(saved));
          } catch {
            sendJson(response, 200, DEFAULT_OPERATIONS_SETTINGS);
          }
          return;
        }

        if (request.method === "PUT") {
          let body = "";
          request.setEncoding("utf8");
          request.on("data", (chunk) => {
            body += chunk;
            if (body.length > 1_000_000) request.destroy();
          });
          request.on("end", async () => {
            try {
              const settings = normalizeOperationsSettings(JSON.parse(body));
              await mkdir(path.dirname(settingsPath), { recursive: true });
              await writeFile(settingsPath, `${JSON.stringify(settings, null, 2)}\n`, "utf8");
              sendJson(response, 200, settings);
            } catch {
              sendJson(response, 400, { error: "Invalid settings payload" });
            }
          });
          return;
        }

        sendJson(response, 405, { error: "Method not allowed" });
      });
    },
  };
}

export default defineConfig({
  base: "./",
  plugins: [react(), localOperationsSettings()],
  build: {
    outDir: "dist/client",
  },
});
