import { CommandInteraction } from 'discord.js';

export function ana(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName) {
    interaction.reply('Eu: 😎 | Vcs: 🤓🤓');
  }
}
