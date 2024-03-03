import { HttpException, Injectable } from '@nestjs/common';
import { SendServerMessageInputDto } from './dto/send-server-message.dto';
import { sendServerMessage } from 'src/utils/send-message-on-channel';

@Injectable()
export class BobService {
  sendServerMessage(dto: SendServerMessageInputDto) {
    try {
      sendServerMessage({
        channelId: dto.channelId,
        message: dto.message,
      });
    } catch (error: any) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }
}
