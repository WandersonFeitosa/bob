import { CommandInteraction } from 'discord.js';
import { NestServices } from 'src/discord/nest-services';

export class DiscordServerStatusService {
  private minecraftService = new NestServices().minecraftService;

  async handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName) {
      const ping = await this.minecraftService.health();
      console.log(ping);
      return interaction.reply(ping.message);
    }
  }
}
