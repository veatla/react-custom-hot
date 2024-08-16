import http, { RequestListener } from "http";

import path from "path";
import { PORT, HOST, connection_string } from "./constants";
import chokidar from "chokidar";
import fileParser from "./file_parser";
import * as Socket from "ws";
import esbuild from "esbuild";

// Простой сборщик на esbuild
const builder = async () => {
  esbuild.build({
    entryPoints: ["./src/main.jsx"],
    bundle: true,
    outfile: "./temp/bundle.js",
    sourcemap: true,
    loader: { ".js": "jsx" },
  });
};

builder().catch(() => process.exit(1));

// Создание наблюдателя
const watcher = chokidar.watch("src", {
  persistent: true,
  ignored: /^\./,
  ignoreInitial: true,
});

// Отслеживание изменений

watcher.on("change", (path) => {
  console.log(`File ${path} has been changed`);

  // Отправка сообщения всем подключенным клиентам
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      const data = {
        file: `src/main.js`,
        type: "change",
      };
      builder()
      client.send(JSON.stringify(data));
    }
  });
});

const urlResolver = (url?: string) => {
  if (!url || url === "/")
    return path.join(process.cwd(), "public", "index.html");
  if (url.startsWith("/src")) return path.join(process.cwd(), url);
  if (url.startsWith("/temp")) return path.join(process.cwd(), url);
  else return path.join(process.cwd(), "public", url);
};

const requestEventListener: RequestListener = function (req, res) {
  const requested_path = urlResolver(req.url);
  fileParser
    .build(requested_path)
    .then((code) => {
      if (requested_path.endsWith(".html"))
        res.end(
          code.replace("./src/main.jsx", "./temp/bundle.js") + connection_string
        );
      else if (requested_path.endsWith(".js")) {
        // Content-Type: application/javascript
        res.setHeader("Content-Type", "application/javascript");
        console.log("set header");
        res.end(code);
      } else {
        res.end(code);
      }
    })
    .catch((error) => {
      console.log(`Error ${requested_path}`, error);
      res.end("<div>Not found</div>");
    });
};

export const server = http.createServer(requestEventListener);
const ws = new Socket.WebSocketServer({
  server: server,
});
server.listen(PORT, HOST, () => {
  console.log(`Server is running on port: http://${HOST}:${PORT}`);
});
