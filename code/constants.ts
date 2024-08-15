export const PORT = 8000;
export const HOST = "localhost";
export const WS = 3030;

export const connection_string =`<script>
  const socket = new WebSocket("ws://localhost:3030");

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    window.location.reload();
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };
</script>
`;