import { Injectable } from '@nestjs/common';
import { WolksProxy } from 'src/infrastructure/proxy/wolks/manager.proxy';

@Injectable()
export class AppService {
  constructor(private readonly wolksProxy: WolksProxy) {}
  getHello(): string {
    return 'Hello World!';
  }
  async healthWolks() {
    const response = await this.wolksProxy.health();
    return response;
  }
}
