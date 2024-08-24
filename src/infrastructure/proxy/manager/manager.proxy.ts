import { Injectable } from '@nestjs/common';
import axios from 'axios';
import {
  ExecuteShellFileDto,
  StartServerOutputDto,
} from './dto/manager-output.dto';

@Injectable()
export class ManagerProxy {
  async startServer({
    serverIp,
    managerPort,
  }: {
    serverIp: string;
    managerPort: number;
  }): Promise<StartServerOutputDto> {
    try {
      const response = await axios.get(
        `http://${serverIp}:${managerPort}/startServer`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error.message);
    }
  }

  async executeShellFile({
    serverIp,
    managerPort,
    filePath,
  }: {
    serverIp: string;
    managerPort: number;
    filePath: string;
  }): Promise<ExecuteShellFileDto> {
    try {
      const response = await axios.post(
        `http://${serverIp}:${managerPort}/execute-shell-file`,
        {
          filePath,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.log('Error: ', error);
      throw new Error(error.message);
    }
  }
}
