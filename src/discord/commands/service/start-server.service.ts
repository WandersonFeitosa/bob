import { CommandInteraction } from 'discord.js';
import { NestServices } from 'src/discord/nest-services';

export class DiscordStartServer {
  private minecraftService = new NestServices().minecraftService;
  async handle(interaction: CommandInteraction) {
    try {
      const start = await this.minecraftService.startServer();
      console.log(start);
      return interaction.reply(start.message);
    } catch (error) {
      console.log(error);
    }
  }
}
