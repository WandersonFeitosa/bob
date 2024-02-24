import { Body, Controller, Get, Post } from '@nestjs/common';
import { BobService } from './bob.service';
import { SendServerMessageInputDto } from './dto/send-server-message.dto';

@Controller('v1/bob')
export class BobController {
  constructor(private readonly bobService: BobService) {}

  @Get()
  getHello(): string {
    return this.bobService.hello();
  }

  @Post('send-server-message')
  sendServerMessage(@Body() dto: SendServerMessageInputDto) {
    return this.bobService.sendServerMessage(dto);
  }
}
