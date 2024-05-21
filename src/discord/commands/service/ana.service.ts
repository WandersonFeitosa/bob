import { CommandInteraction } from 'discord.js';

export class DiscordAnaService {
  handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName) {
      interaction.reply('Eu: 😎 | Vcs: 🤓🤓');
    }
  }
}
