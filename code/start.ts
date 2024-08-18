import http, { RequestListener } from "http";

import path from "path";
import { PORT, HOST, frontend_ws_code, BUILD_DIR } from "./constants";
import chokidar from "chokidar";
import fileParser from "./file_parser";
import * as Socket from "ws";
import esbuild from "esbuild";

// Простой сборщик на esbuild
const builder = async () => {
  return esbuild.build({
    entryPoints: ["./src/main.jsx"],
    bundle: true,
    outfile: path.join(BUILD_DIR, 'temp', "bundle.js"),
    sourcemap: true,
    jsx: 'automatic',
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

watcher.on("change", (path, stats) => {
  console.log(`File ${path} has been changed`);
  
  // Отправка сообщения всем подключенным клиентам
  ws.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      builder().then(() => {
        const data = {
          file: path,
          type: "change",
        };
        client.send(JSON.stringify(data));
      });
    }
  });
});

const urlResolver = (url?: string) => {
  if (!url || url === "/")
    return path.join(process.cwd(), "public", "index.html");
  if (url.startsWith("/src")) return path.join(BUILD_DIR, url);
  if (url.startsWith("/temp")) return path.join(BUILD_DIR, url);
  else if (path.isAbsolute(url)) return path.join(process.cwd(), "public", url);
  else return path.join(BUILD_DIR, url);
};

const requestEventListener: RequestListener = async function (req, res) {
  const requested_path = urlResolver(req.url);
  console.log(`Requesting file: ${requested_path} before parse: ${req.url}`);
  const filedata = await fileParser.build(requested_path).catch(() => null);

  if (!filedata) {
    res.statusCode = 404;
    res.end();
    return;
  }

  // If it's html
  if (requested_path.endsWith(".html")) {
    // Replace <script/> import source with builded file
    const replace_script_import =
      filedata.replace("./src/main.jsx", "./temp/bundle.js") +
      frontend_ws_code;

    // send to frontend
    res.end(replace_script_import);
  }
  // if it's js file
  else if (requested_path.endsWith(".js")) {
    // set the repsonse header
    res.setHeader("Content-Type", "application/javascript");
    // send to frontend
    res.end(filedata);
  }
  // otherwise just send data to frontend
  else res.end(filedata);
};

export const server = http.createServer(requestEventListener);
const ws = new Socket.WebSocketServer({
  server: server,
});
server.listen(PORT, HOST, () => {
  console.log(`Server is running on port: http://${HOST}:${PORT}`);
});
