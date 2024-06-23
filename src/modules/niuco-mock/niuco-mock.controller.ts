import { Controller, Get } from '@nestjs/common';
import { NiucoMockService } from './niuco-mock.service';

@Controller('v1/niuco-mock')
export class NiucoMockController {
  constructor(private readonly niucoMockService: NiucoMockService) {}

  @Get('/users')
  getUsers(): any[] {
    return this.niucoMockService.getUsers();
  }
}
