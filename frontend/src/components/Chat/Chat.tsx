"use client"
import { useState, useRef, useEffect } from "react"
import styles from "@/components/Chat/chat.module.css"
import { useSocket } from "@/hooks/useSocket"

export default function Chat({ roomId, username }: { roomId: string; username: string }) {
  const { messages, sendMessage } = useSocket(roomId, username)
  const [text, setText] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (text.trim()) {
      sendMessage(text)
      setText("")
    }
  }

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className={styles.chatContainer}>
      <div className={styles.messages} ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`${styles.message} ${m.user === username ? styles.myMessage : styles.otherMessage}`}>
            <span className={styles.senderName}>{m.user}</span>
            <span className={styles.messageText}>{m.text}</span>
          </div>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          className={styles.input}
          value={text}
          placeholder="Написати повідомлення..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button className={styles.sendButton} onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  )
}
