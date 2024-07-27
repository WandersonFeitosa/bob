import axios from 'axios';
import { CommandInteraction } from 'discord.js';

export class DiscordServerCommandsService {
  handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;
  }

  async resetPassword(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;

      await interaction.deferReply({
        ephemeral: true,
      });

      const nickName = interaction.options.getString('nickname');
      const managerUrl = `http://${process.env.MINECRAFT_SERVER_IP}:${process.env.MINECRAFT_MANAGER_PORT}/execute-command`;

      const response = await axios.post(
        managerUrl,
        {
          command: `simplelogin unregister ${nickName}`,
          screenName: 'tcsmp',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );

      const { data } = response;

      if (data.error) {
        await interaction.editReply(data.error);
        return;
      }

      await interaction.editReply(
        data.message ? data.message : 'Senha resetada com sucesso',
      );

      return;
    } catch (error) {
      console.error('Error on resetPassword', error);

      interaction.editReply('Erro ao resetar a senha');
    }
  }
}
