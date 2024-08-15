import { Server } from "ws";
import { HOST, WS } from "./constants";

const ws = new Server({
  port: WS,
  host: HOST,
});


export default ws;
