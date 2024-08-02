import { CommandInteraction } from 'discord.js';
import { nestServices } from 'src/discord/nest-services';

export class DiscordServerStatusService {
  private minecraftService = nestServices.minecraftService;

  async handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName) {
      const ping = await this.minecraftService.health();
      console.log(ping);
      return interaction.reply(ping.message);
    }
  }
}
