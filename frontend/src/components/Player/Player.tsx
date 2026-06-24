"use client"
import { useEffect } from "react"
import { socket } from "@/lib/socket"
import styles from "@/components/Player/player.module.css"
import { useVideoPlayer } from "@/hooks/useVideoPlayer"
import { useVideoSource } from "@/hooks/useVideoSource"
import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa"

export default function Player({ videoId, roomId }: { videoId: string; roomId: string }) {
  const { streamUrl, loading } = useVideoSource(videoId)
  const player = useVideoPlayer()

  useEffect(() => {
    socket.on("player_action", async (data: { action: string; time: number }) => {
      const video = player.videoRef.current
      if (!video) return
      if (data.time !== undefined) video.currentTime = data.time
      if (data.action === "play") {
        video.play().catch(() => {})
        player.setIsPlaying(true)
      } else if (data.action === "pause") {
        video.pause()
        player.setIsPlaying(false)
      } else if (data.action === "seek") {
        video.currentTime = data.time
      }
    })
    return () => {
      socket.off("player_action")
    }
  }, [player])

  const emitAction = (action: string) => {
    socket.emit("player_action", { roomId, action, time: player.videoRef.current?.currentTime })
  }

  return (
    <div className={styles.playerWrapper}>
      {loading ? (
        <div className={styles.loadingMessage}>Завантаження...</div>
      ) : streamUrl ? (
        <>
          <video
            ref={player.videoRef}
            src={streamUrl}
            className={styles.videoElement}
            onLoadedMetadata={(e) => player.setDuration(e.currentTarget.duration)}
            onTimeUpdate={(e) => {
              player.setCurrentTime(e.currentTarget.currentTime)
              player.setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100)
            }}
          />

          <div className={styles.controlsOverlay}>
            <div className={styles.timeDisplay}>
              {player.formatTime(player.currentTime)} / {player.formatTime(player.duration)}
            </div>

            <div className={styles.buttonsGroup}>
              <button
                className={styles.controlBtn}
                onClick={() => {
                  player.skip(-10)
                  emitAction("seek")
                }}
              >
                <FaBackward />
              </button>
              <button
                className={styles.controlBtn}
                onClick={() => {
                  const isPlaying = !player.isPlaying
                  isPlaying ? player.videoRef.current?.play() : player.videoRef.current?.pause()
                  emitAction(isPlaying ? "play" : "pause")
                }}
              >
                {player.isPlaying ? <FaPause /> : <FaPlay />}
              </button>
              <button
                className={styles.controlBtn}
                onClick={() => {
                  player.skip(10)
                  emitAction("seek")
                }}
              >
                <FaForward />
              </button>
            </div>

            <div
              className={styles.progressBar}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const pos = (e.clientX - rect.left) / rect.width
                player.videoRef.current!.currentTime = pos * player.duration
                emitAction("seek")
              }}
            >
              <div className={styles.progress} style={{ width: `${player.progress}%` }} />
            </div>
          </div>
        </>
      ) : (
        <div className={styles.loadingMessage}>Помилка завантаження</div>
      )}
    </div>
  )
}
