export const PORT = 8000;
export const HOST = "localhost";
export const WS = 3030;

export const frontend_ws_code = `<script>
  function conn() {
    const socket = new WebSocket('ws://localhost:8000');
    socket.onopen = function() {
      console.log("ws:connected");
    };


    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("ws:message::", data);
      fetch('http://localhost:8000/' + data.file, {
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

