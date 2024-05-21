import { CommandInteraction } from 'discord.js';
import { sendServerMessage } from 'src/utils/send-message-on-channel';

export class DiscordSendMessageInServerWithCommand {
  async handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName) {
      try {
        const message = interaction.options.getString('mensagem');
        const channel = interaction.options.getChannel('canal');
        const channelId = channel.id;
        await sendServerMessage({ channelId, message });
        interaction.reply({
          content: 'Mensagem enviada com sucesso!',
          ephemeral: true,
        });
      } catch (error) {
        interaction.reply({
          content: 'Erro ao enviar mensagem',
          ephemeral: true,
        });
      }
    }
  }
}
