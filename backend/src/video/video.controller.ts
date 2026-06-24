import { Controller, Get, Query } from "@nestjs/common"
import { VideoService } from "./video.service"

@Controller("api/video")
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get()
  async getVideo(@Query("videoId") videoId: string) {
    return await this.videoService.getStreamUrl(videoId)
  }
}
