import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as net from 'net';
import { PrismaService } from 'src/prisma/prisma.service';
import { BobService } from '../bob/bob.service';
import { DiscordGetHybridService } from 'src/discord/commands/service/get-hybrids.service';
import { sendServerMessage } from '../../utils/send-message-on-channel';
import { AttachmentBuilder } from 'discord.js';

@Injectable()
export class MinecraftService {
  constructor(
    private prisma: PrismaService,
    private bobService: BobService,
  ) {}

  serverIp = process.env.MINECRAFT_SERVER_IP || '35.222.128.103';
  serverPort = parseInt(process.env.MINECRAFT_SERVER_PORT) || 25565;
  managerPort = parseInt(process.env.MINECRAFT_MANAGER_PORT) || 3003;
  announceChannelKeys = process.env.SERVER_STATUS_LIST.split(',') || [];
  announceChannelIds = this.announceChannelKeys.map((key) => process.env[key]);

  async ping(): Promise<boolean> {
    try {
      const response = new Promise<boolean>((resolve) => {
        const socket = net.createConnection({
          port: this.serverPort,
          host: this.serverIp,
        });

        // Set timeout for ping response
        const timeout = setTimeout(() => {
          socket.destroy(); // Close the socket on timeout
          resolve(false); // Indicate unsuccessful ping
        }, 500); // Adjust timeout as needed (milliseconds)

        socket.on('connect', () => {
          clearTimeout(timeout); // Clear timeout if connection established
          socket.end(); // Immediately close the socket after successful connection
          resolve(true); // Indicate successful ping
        });

        socket.on('error', () => {
          clearTimeout(timeout); // Clear timeout on error
          socket.destroy(); // Close the socket on error
          resolve(false); // Indicate unsuccessful ping
        });
      });
      return response;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async health(): Promise<{
    statusCode: number;
    message: string;
  }> {
    const serverResponse = await this.ping();
    const dbServerStatus = await this.prisma.minecraftServerStatus.findFirst({
      where: {
        ip: this.serverIp,
        port: this.serverPort,
      },
    });

    if (!dbServerStatus)
      throw new HttpException(
        `${this.serverIp}:${this.serverPort} not found in database`,
        404,
      );

    if (serverResponse) {
      if (
        dbServerStatus.status !== 'online' &&
        dbServerStatus.status !== 'backup'
      ) {
        this.announceChannelIds.forEach(async (channelId) => {
          await this.bobService.sendServerMessage({
            channelId,
            message: `O servidor está online`,
          });
        });
        await this.prisma.minecraftServerStatus.update({
          where: {
            id: dbServerStatus.id,
          },
          data: {
            status: 'online',
            offlineCount: 0,
          },
        });
      }

      console.log('Server status:', dbServerStatus.status);
      return {
        statusCode: 200,
        message: 'O servidor está online',
      };
    }

    console.log('Server status:', dbServerStatus.status);

    if (dbServerStatus.status === 'stopped') {
      return {
        statusCode: 200,
        message: 'O servidor está parado',
      };
    }

    if (dbServerStatus.status === 'starting') {
      return {
        statusCode: 200,
        message: 'O servidor está iniciando, aguarde um momento.',
      };
    }

    if (dbServerStatus.status === 'backup') {
      return {
        statusCode: 200,
        message: 'O servidor está realizando backup, aguarde um momento.',
      };
    }

    if (dbServerStatus.offlineCount < 1) {
      await this.prisma.minecraftServerStatus.update({
        where: {
          id: dbServerStatus.id,
        },
        data: {
          offlineCount: dbServerStatus.offlineCount + 1,
        },
      });
      return {
        statusCode: 200,
        message: 'O servidor está offline',
      };
    }

    this.announceChannelIds.forEach((channelId) => {
      this.bobService.sendServerMessage({
        channelId,
        message: 'O servidor está offline, iniciando o servidor.',
      });
    });

    await this.prisma.minecraftServerStatus.update({
      where: {
        id: dbServerStatus.id,
      },
      data: {
        status: 'offline',
      },
    });

    this.startServer();

    return {
      statusCode: 200,
      message: 'O servidor está offline, iniciando o servidor.',
    };
  }

  async startServer(): Promise<{
    statusCode: number;
    message: string;
  }> {
    try {
      const dbServerStatus = await this.prisma.minecraftServerStatus.findFirst({
        where: {
          ip: this.serverIp,
          port: this.serverPort,
        },
      });

      if (
        dbServerStatus.status === 'online' ||
        dbServerStatus.status === 'backup' ||
        dbServerStatus.status === 'starting'
      )
        return {
          statusCode: 200,
          message: 'O servidor já está iniciando ou online',
        };

      const response = await axios.get(
        `http://${this.serverIp}:${this.managerPort}/startServer`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );

      await this.prisma.minecraftServerStatus.update({
        where: {
          id: dbServerStatus.id,
        },
        data: {
          status: 'starting',
        },
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async updateStatus(dto: { status: string }): Promise<void> {
    try {
      const dbServerStatus = await this.prisma.minecraftServerStatus.findFirst({
        where: {
          ip: this.serverIp,
          port: this.serverPort,
        },
      });

      await this.prisma.minecraftServerStatus.update({
        where: {
          id: dbServerStatus.id,
        },
        data: {
          status: dto.status,
        },
      });
      return;
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  async startBackup(): Promise<void> {
    console.log('Starting backup');
    try {
      const server = await this.prisma.minecraftServerStatus.findFirst({
        where: {
          ip: this.serverIp,
          port: this.serverPort,
        },
      });

      await this.prisma.minecraftServerStatus.update({
        where: {
          id: server.id,
        },
        data: {
          status: 'backup',
        },
      });

      const response = await axios.get(
        `http://${this.serverIp}:${this.managerPort}/startBackup`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );

      return response.data.message;
    } catch (error) {
      console.log(error);
    }
  }

  async getHybridStatus(): Promise<any> {
    const hybridService = new DiscordGetHybridService();

    const hybrids = await this.prisma.hybrids.findMany();

    const buffer = await hybridService.generateHybridGroupImage(hybrids);

    const hybridAttachment = new AttachmentBuilder(buffer);

    await sendServerMessage({
      channelId: '870793429406347337',
      message: 'Status dos híbridos',
      files: [hybridAttachment],
    });

    return buffer;
  }
}
