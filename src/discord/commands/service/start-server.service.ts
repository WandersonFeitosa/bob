import { CommandInteraction } from 'discord.js';
import { minecraftService } from '../commands.module';

export class DiscordStartServer {
  async handle(interaction: CommandInteraction) {
    try {
      const start = await minecraftService.startServer();
      console.log(start);
      return interaction.reply(start.message);
    } catch (error) {
      console.log(error);
    }
  }
}
