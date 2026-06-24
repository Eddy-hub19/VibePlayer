import { useState, useEffect } from "react"

export function useVideoSource(videoId: string) {
  const [data, setData] = useState({ streamUrl: "", loading: true })

  useEffect(() => {
    if (!videoId) return

    fetch(`http://localhost:3001/api/video?videoId=${videoId}`) // Прямий порт бекенда
      .then((res) => res.json())
      .then((json) => {
        setData({ streamUrl: json.streamUrl || "", loading: false })
      })
      .catch(() => setData({ streamUrl: "", loading: false }))
  }, [videoId])

  return data
}
