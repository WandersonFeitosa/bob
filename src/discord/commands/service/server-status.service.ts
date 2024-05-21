import { CommandInteraction } from 'discord.js';
import { minecraftService } from '../commands.module';

export class DiscordServerStatusService {
  async handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName) {
      const ping = await minecraftService.health();
      console.log(ping);
      return interaction.reply(ping.message);
    }
  }
}
