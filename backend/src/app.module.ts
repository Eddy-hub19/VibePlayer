import { Module } from "@nestjs/common"
import { ChatGateway } from "./chat/chat.gateway"
import { VideoModule } from "./video/video.module"

@Module({
  imports: [VideoModule],
  providers: [ChatGateway],
})
export class AppModule {}
