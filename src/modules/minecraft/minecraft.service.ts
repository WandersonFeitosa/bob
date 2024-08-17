import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as net from 'net';
import { PrismaService } from 'src/prisma/prisma.service';
import { BobService } from '../bob/bob.service';
import { sendServerMessage } from 'src/utils/send-message-on-channel';
import { ManagerProxy } from 'src/infrastructure/proxy/manager.proxy';

@Injectable()
export class MinecraftService {
  updatingLogs = false;
  constructor(
    private prisma: PrismaService,
    private bobService: BobService,
    private managerProxy: ManagerProxy,
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

        await this.disableAvaDrops();
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
      const serverStartValidation = await this.validateServerStart();
      if (serverStartValidation) {
        return {
          statusCode: 200,
          message: 'O servidor está iniciando, aguarde um momento.',
        };
      }
      return {
        statusCode: 200,
        message: 'O servidor está iniciando, forçando início.',
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

  async validateServerStart(): Promise<boolean> {
    const dbServerStatus = await this.prisma.minecraftServerStatus.findFirst({
      where: {
        ip: this.serverIp,
        port: this.serverPort,
      },
    });

    const ping = await this.ping();

    if (dbServerStatus.status !== 'starting' || ping) return;

    const date = new Date();
    const lastUpdate = dbServerStatus.update_at;

    const diff = date.getTime() - lastUpdate.getTime();

    if (diff > 1000 * 60 * 2) {
      await this.managerProxy.executeShellFile({
        serverIp: this.serverIp,
        managerPort: this.managerPort,
        filePath:
          process.env.MINECRAFT_FORCE_START_SCRIPT_PATH ||
          '/home/ssd/projects/mcs-manager/start_server.sh',
      });

      console.log('Forcing server start');

      this.announceChannelIds.forEach((channelId) => {
        this.bobService.sendServerMessage({
          channelId,
          message: 'Servidor não iniciado, forçando início.',
        });
      });

      await this.prisma.minecraftServerStatus.update({
        where: {
          id: dbServerStatus.id,
        },
        data: {
          status: 'starting',
        },
      });

      return false;
    }
    return true;
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

      const response = await this.managerProxy.startServer({
        serverIp: this.serverIp,
        managerPort: this.managerPort,
      });

      await this.prisma.minecraftServerStatus.update({
        where: {
          id: dbServerStatus.id,
        },
        data: {
          status: 'starting',
        },
      });

      return {
        statusCode: 200,
        message: response.message,
      };
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

  async disableAvaDrops(): Promise<void> {
    try {
      const managerUrl = `http://${process.env.MINECRAFT_SERVER_IP}:${process.env.MINECRAFT_MANAGER_PORT}/execute-command`;

      const response = await axios.post(
        managerUrl,
        {
          command: `ava setMobDropKitChance 0`,
          screenName: 'tcsmp',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );

      const { data } = response;

      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.log(error);
      throw new Error('Error on disableAvaDrops');
    }
  }

  async getServerLogs(): Promise<any> {
    if (this.updatingLogs) {
      console.log('Logs are being updated');
      return { statusCode: 200, message: 'Updating logs' };
    }
    try {
      console.log('Getting server logs');
      const response = await axios.get(
        `http://${this.serverIp}:${this.managerPort}/read-content`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );

      const fileContent: string = response.data.file;

      const logs = fileContent.split('\n');

      console.log(`${logs.length} logs found`);

      let lastIndexWithDate = 0;
      for (let i = logs.length - 1; i >= 0; i--) {
        if (logs[i].match(/\[\d{2}\w{3}\d{4}\s\d{2}:\d{2}:\d{2}\.\d{3}\]/)) {
          lastIndexWithDate = i;
          break;
        }
      }

      const lastLogMessage = logs[lastIndexWithDate];
      const lastLogDate = this.getMessageTime(lastLogMessage);

      const lastSentLogData = await this.prisma.minecraftServerStatus.findFirst(
        {
          where: {
            ip: this.serverIp,
            port: this.serverPort,
          },
          select: {
            last_log_time: true,
            last_log_message: true,
          },
        },
      );

      let lastLogSentIndex: number = 0;
      if (lastSentLogData.last_log_time < lastLogDate) {
        for (let i = logs.length - 1; i >= 0; i--) {
          if (logs[i].match(/\[\d{2}\w{3}\d{4}\s\d{2}:\d{2}:\d{2}\.\d{3}\]/)) {
            const logDate = this.getMessageTime(logs[i]);
            if (logDate < lastSentLogData.last_log_time) {
              lastLogSentIndex = i;
              break;
            }
          }
        }
      }
      const lastMessage = logs[logs.length - 2];
      if (
        lastLogSentIndex === 0 &&
        lastMessage === lastSentLogData.last_log_message
      ) {
        console.log('No pending logs');
        return {
          statusCode: 200,
          message: 'No pending logs',
        };
      }

      const logsToSend = logs.slice(lastLogSentIndex, logs.length - 1);

      console.log(`${logsToSend.length} pending logs`);

      this.updatingLogs = true;
      const totalLogsToSend = logsToSend.length;
      let logsSent = 0;
      let logsSentPercentage = 0;
      for (let i = 0; i < totalLogsToSend; i++) {
        logsSent++;
        logsSentPercentage = (logsSent / totalLogsToSend) * 100;
        console.log(
          `Sending log ${logsSent} of ${totalLogsToSend} (${logsSentPercentage.toFixed(2)}%)`,
        );
        const message = logsToSend[i];

        if (message.length > 1999) continue;

        await sendServerMessage({
          channelId:
            process.env.SERVER_LOGS_CHANNEL_ID || '1266622588629815328',
          message: '```' + logsToSend[i] + '```',
        });
      }

      await this.prisma.minecraftServerStatus.updateMany({
        where: {
          ip: this.serverIp,
          port: this.serverPort,
        },
        data: {
          last_log_time: lastLogDate,
          last_log_message: lastLogMessage,
        },
      });

      this.updatingLogs = false;
      return {
        statusCode: 200,
        message: 'Logs enviados',
        lastLogMessage,
        lastLogDate,
        lastLogSentIndex,
        logsToSend,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(error, 500);
    }
  }

  getMessageTime(message: string): Date {
    const date = message.split(' ')[0].replace('[', '');
    const time = message.split(' ')[1].replace(']', '');

    const day = date.slice(0, 2);
    const month = date.slice(2, 5);
    const year = date.slice(5, 9);
    const hour = time.slice(0, 2);
    const minute = time.slice(3, 5);
    const second = time.slice(6, 8);
    const millisecond = time.slice(9, 12);

    const logDate = new Date(
      `${month} ${day}, ${year} ${hour}:${minute}:${second}.${millisecond}`,
    );

    return new Date(logDate.getTime() - 3 * 60 * 60 * 1000);
  }
}
