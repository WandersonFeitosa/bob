import { CommandInteraction } from 'discord.js';

export function ping(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName) {
    interaction.reply('Pong!');
  }
}
