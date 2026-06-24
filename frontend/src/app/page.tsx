"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import UsernameModal from "@/components/UsernameModal/UsernameModal"
import styles from "@/components/Player/player.module.css"

export default function Home() {
  const [url, setUrl] = useState("")
  const [username, setUsername] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const savedName = localStorage.getItem("chat_username")
    if (savedName) {
      setUsername(savedName)
      setShowModal(false)
    }
  }, [])

  const handleWatch = () => {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/,
    )
    const id = match ? match[1] : ""
    if (!id) return alert("Невірне посилання!")

    const roomId = `room-${id}`
    router.push(`/watch/${roomId}?videoId=${id}`)
  }

  return (
    <main className={styles.playerContainer}>
      {showModal ? (
        <UsernameModal
          onSave={(name) => {
            localStorage.setItem("chat_username", name)
            setUsername(name)
            setShowModal(false)
          }}
        />
      ) : (
        <div className={styles.content}>
          <input
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Посилання YouTube"
          />
          <button className={styles.btn} onClick={handleWatch}>
            Створити кімнату
          </button>
        </div>
      )}
    </main>
  )
}
