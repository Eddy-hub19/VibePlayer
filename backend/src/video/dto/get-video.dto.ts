import { IsNotEmpty, IsUrl, IsString } from "class-validator"
import { Transform } from "class-transformer"

export class GetVideoDto {
  @Transform(({ value }) => value?.trim().split(/[?&]si=/)[0])
  @IsNotEmpty()
  @IsString()
  @IsUrl({ protocols: ["http", "https"] })
  url!: string
}
