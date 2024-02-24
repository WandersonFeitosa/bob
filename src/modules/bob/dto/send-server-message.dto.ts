import { IsNumber, IsString } from 'class-validator';

export class SendServerMessageInputDto {
  @IsString()
  channelId: string;

  @IsString()
  message: string;
}
