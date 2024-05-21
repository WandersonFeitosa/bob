import { CommandInteraction } from 'discord.js';

export class DiscordPingService {
  handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName) {
      interaction.reply('Pong!');
    }
  }
}
