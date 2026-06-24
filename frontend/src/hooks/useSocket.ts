import { useEffect, useState } from "react"
import { socket } from "@/lib/socket"

export const useSocket = (roomId: string, username: string | null) => {
  const [messages, setMessages] = useState<any[]>([])

  useEffect(() => {
    if (!roomId || !username) return

    socket.emit("join_room", { roomId, username })

    const onHistory = (history: any[]) => setMessages(history)
    const onMessage = (msg: any) => setMessages((prev) => [...prev, msg])

    socket.on("chat_history", onHistory)
    socket.on("chat_message", onMessage)

    return () => {
      socket.off("chat_history", onHistory)
      socket.off("chat_message", onMessage)
    }
  }, [roomId, username])

  const sendMessage = (text: string) => {
    socket.emit("chat_message", { roomId, user: username, text })
  }

  return { messages, sendMessage }
}
