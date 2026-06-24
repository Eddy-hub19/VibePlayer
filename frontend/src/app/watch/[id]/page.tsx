"use client"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import Player from "@/components/Player/Player"
import Chat from "@/components/Chat/Chat"
import UsernameModal from "@/components/UsernameModal/UsernameModal"

export default function WatchPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const roomId = params.id as string
  const videoId = searchParams.get("videoId") || ""
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    setUsername(localStorage.getItem("chat_username"))
  }, [])

  if (!username)
    return (
      <UsernameModal
        onSave={(name) => {
          localStorage.setItem("chat_username", name)
          setUsername(name)
        }}
      />
    )

  return (
    <main>
      <h1>Кімната: {roomId}</h1>
      <Player videoId={videoId} roomId={roomId} />
      <Chat roomId={roomId} username={username} />
    </main>
  )
}
