import axios from 'axios';
import { CommandInteraction } from 'discord.js';

export class DiscordServerCommandsService {
  handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;
  }

  async resetPassword(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;

      interaction.deferReply();

      const nickName = interaction.options.getString('nickname');
      const managerUrl = `http://${process.env.MINECRAFT_SERVER_IP}:${process.env.MINECRAFT_SERVER_PORT}/execute-command`;

      const response = await axios.post(managerUrl, {
        command: `simplelogin unregister ${nickName}`,
        screenName: 'tcsmp',
      });

      const { data } = response;

      if (data.error) {
        interaction.editReply(data.error);
        return;
      }

      interaction.editReply(
        data.message ? data.message : 'Senha resetada com sucesso',
      );

      return;
    } catch (error) {
      console.error('Error on resetPassword', error);

      interaction.editReply('Erro ao resetar a senha');
    }
  }
}
