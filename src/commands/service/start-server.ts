import { CommandInteraction } from 'discord.js';

export function startServer(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName) {
    interaction.reply('Inciando servidor, aguarde');
  }
}
