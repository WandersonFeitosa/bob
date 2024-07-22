import { CommandInteraction } from 'discord.js';
import { nestServices } from 'src/discord/nest-services';

export class DiscordStartServer {
  private minecraftService = nestServices.minecraftService;
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
