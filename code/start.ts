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

const requestEventListener: RequestListener = function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  fs.readFile(
    path.join(process.cwd(), "index.html"),
    { encoding: "utf-8" },
    (error, value) => {
      if (error) res.end("<div>Not found</div>");
      res.end(value.replace('</body>', `${connection_string}</body>`));
    }
  );
};

const server = http.createServer(requestEventListener);

server.listen(PORT, HOST, () => {
  console.log(`Server is running on port: http://${HOST}:${PORT}`);
});
