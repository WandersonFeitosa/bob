import { CommandInteraction } from 'discord.js';

export class CommandPingService {
  handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName) {
      interaction.reply('Pong!');
    }
  }
}
