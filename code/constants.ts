export const PORT = 8000;
export const HOST = "localhost";
export const WS = 3030;

export const connection_string = `<script>
  const socket = new WebSocket("ws://localhost:8000");

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("Message from server:", data);
    setTimeout(() => {
      fetch('http://localhost:8000/' + data.file, {
        mode: 'no-cors'
      }).then((res) => {
        res.text().then((buff) => {
          eval(buff)
        })
      });
    }, 1000)
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
</script>
`;
