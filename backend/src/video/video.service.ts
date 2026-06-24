import { Injectable, InternalServerErrorException, Logger } from "@nestjs/common"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)
const logger = new Logger("VideoService")

@Injectable()
export class VideoService {
  async getStreamUrl(videoId: string) {
    const id = videoId.length === 11 ? videoId : this.extractVideoId(videoId)

    if (!id) {
      logger.error(`Не вдалося отримати ID з: ${videoId}`)
      throw new InternalServerErrorException("Невірний формат посилання або ID")
    }

    const cleanUrl = `https://www.youtube.com/watch?v=${id}`
    logger.log(`Отримання посилання для: ${cleanUrl}`)

    try {
      const { stdout } = await execAsync(`yt-dlp -g -f "best[ext=mp4]/best" --no-playlist "${cleanUrl}"`)
      return { streamUrl: stdout.trim() }
    } catch (e) {
      logger.error(`YT-DLP Error: ${e.message}`)
      throw new InternalServerErrorException("Відео не знайдено або обмежено для перегляду")
    }
  }

  private extractVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }
}
