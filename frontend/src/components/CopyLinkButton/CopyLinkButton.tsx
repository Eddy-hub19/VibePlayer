"use client"
import { useState } from "react"

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    // Отримуємо поточний URL сторінки
    const link = window.location.href
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      onClick={copyToClipboard}
      style={{
        padding: "8px 16px",
        backgroundColor: copied ? "#4CAF50" : "#0070f3",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "10px",
      }}
    >
      {copied ? "Посилання скопійовано!" : "Запросити друга"}
    </button>
  )
}
