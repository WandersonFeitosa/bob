import { CommandInteraction } from 'discord.js';

export function dummy(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName) {
    interaction.reply('Eu: 😎 | Vcs: 🤓🤓');
  }
}
