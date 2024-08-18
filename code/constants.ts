import config from '../config.json';
import path from "path";

export const PORT = config.port || 8000;
export const HOST = "localhost";

export const BUILD_DIR = path.join(process.cwd(), "node_modules", "@veatla");

export const frontend_ws_code = `<script>
  function conn() {
    const socket = new WebSocket('ws://localhost:${PORT}');
    socket.onopen = function() {
      console.log("ws:connected");
    };


    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("ws:message::", data);
      fetch('http://localhost:${PORT}/' + data.file, {
        mode: 'no-cors'
      }).then((res) => {
        res.text().then((buff) => {
          eval(buff)
        })
      });
    };
      
    socket.onclose = function(e) {
      console.log('ws:reconnecting::1sec');
      setTimeout(function() {
        conn();
      }, 1000);
    };

    socket.onerror = function(err) {
      socket.close();
    };
  }

  conn();
</script>
`;

