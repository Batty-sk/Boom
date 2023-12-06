import { Socket,io } from "socket.io-client";

const socket:Socket=io('https://boom-backend.vercel.app')

export default socket

