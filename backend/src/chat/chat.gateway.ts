import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { VideoService } from "../video/video.service"

@WebSocketGateway({ cors: true, path: "/chat", transports: ["websocket"] })
export class ChatGateway {
  @WebSocketServer() server!: Server
  constructor(private readonly videoService: VideoService) {}

  private roomVideos: Map<string, string> = new Map()
  private roomMessages: Map<string, any[]> = new Map()

  @SubscribeMessage("join_room")
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() data: { roomId: string; username: string }) {
    client.join(data.roomId)

    // Відправляємо стан кімнати конкретному користувачу, що щойно зайшов
    client.emit("video_update", { url: this.roomVideos.get(data.roomId) })
    client.emit("chat_history", this.roomMessages.get(data.roomId) || [])
  }

  // ОСЬ ЦЕЙ МЕТОД ЗАБЕЗПЕЧУЄ СИНХРОНІЗАЦІЮ ДЛЯ ВСІХ
  @SubscribeMessage("player_action")
  handlePlayerAction(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; action: string; time: number },
  ) {
    // Розсилаємо ВСІМ (включаючи ініціатора) оновлений стан плеєра
    // Це дозволяє всім плеєрам вирівнятися по одному таймкоду та дії
    this.server.to(data.roomId).emit("player_action", data)
  }

  @SubscribeMessage("video_url_change")
  async handleVideoChange(@MessageBody() data: { roomId: string; url: string }) {
    const result = await this.videoService.getStreamUrl(data.url)
    if (result.streamUrl) {
      this.roomVideos.set(data.roomId, result.streamUrl)
      this.server.to(data.roomId).emit("video_update", { url: result.streamUrl })
    }
  }

  @SubscribeMessage("chat_message")
  handleChatMessage(@MessageBody() data: { roomId: string; user: string; text: string }) {
    const messages = this.roomMessages.get(data.roomId) || []
    const newMessage = { ...data, timestamp: Date.now() }
    messages.push(newMessage)
    this.roomMessages.set(data.roomId, messages)

    // Надсилаємо повідомлення всім у кімнаті
    this.server.to(data.roomId).emit("chat_message", newMessage)
  }
}
