import { useState } from "react"
import styles from "@/components/UsernameModal/modal.module.css"

export default function UsernameModal({ onSave }: { onSave: (name: string) => void }) {
  const [name, setName] = useState("")

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.modalTitle}>Як тебе звати?</h2>
        <div className={styles.inputGroup}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Введіть ім'я..." />
          <button onClick={() => name.trim() && onSave(name)}>Війти в чат</button>
        </div>
      </div>
    </div>
  )
}
