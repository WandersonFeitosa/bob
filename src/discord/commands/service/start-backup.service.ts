import axios from 'axios';
import { CommandInteraction } from 'discord.js';
import { NestServices } from 'src/discord/nest-services';

export class DiscordStartBackupService {
  private prismaService = new NestServices().prisma;
  serverIp = process.env.MINECRAFT_SERVER_IP || '35.222.128.103';
  serverPort = parseInt(process.env.MINECRAFT_SERVER_PORT) || 25565;
  managerPort = parseInt(process.env.MINECRAFT_MANAGER_PORT) || 3003;

  async handle(interaction: CommandInteraction) {
    try {
      const server = await this.prismaService.minecraftServerStatus.findFirst({
        where: {
          ip: this.serverIp,
          port: this.serverPort,
        },
      });

      await this.prismaService.minecraftServerStatus.update({
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

      return interaction.reply(response.data.message);
    } catch (error) {
      console.log(error);
    }
  }
}
