import { io } from "socket.io-client"

export const socket = io("http://localhost:3001", {
  path: "/chat",
  transports: ["websocket"],
  autoConnect: true,
})
