import { Socket,io } from "socket.io-client";

const socket:Socket=io('http://localhost:3001')

export default socket

