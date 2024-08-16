import http, { RequestListener } from "http";

import fs from "fs";
import path from "path";
import { PORT, HOST, connection_string } from "./constants";
import chokidar from "chokidar";
import ws from "./ws";

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
      client.send(`File ${path} has been changed`);
    }
  });
});

const urlResolver = (url?: string) => {
  if (!url || url === '/') return path.join(process.cwd(), "public", "index.html");
  if (url.startsWith("/src")) return path.join(process.cwd(), url);
  else return path.join(process.cwd(), "public", url);
};

const requestEventListener: RequestListener = function (req, res) {
  const requested_path = urlResolver(req.url);
  res.writeHead(200);
  fs.readFile(requested_path, { encoding: "utf-8" }, (error, value) => {
    if (error) {
      res.end("<div>Not found</div>");
      console.log(requested_path);
      return;
    }
    if (requested_path.endsWith(".html"))
      res.end(value.replace("</body>", `${connection_string}</body>`));
    else res.end(value);
  });
};

const server = http.createServer(requestEventListener);

server.listen(PORT, HOST, () => {
  console.log(`Server is running on port: http://${HOST}:${PORT}`);
});
