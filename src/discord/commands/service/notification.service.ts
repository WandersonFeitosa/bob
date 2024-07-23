import { Hybrids, Player } from '@prisma/client';
import { CommandInteraction } from 'discord.js';
import { nestServices } from 'src/discord/nest-services';
import { sendServerMessage } from 'src/utils/send-message-on-channel';

export class DiscordNotificationService {
  prisma = nestServices.prisma;
  playerNotificationChannelId =
    process.env.PLAYER_NOTIFICATION_CHANNEL_ID || '1259271419947253851';
  hybridNotificationChannelId =
    process.env.HYBRID_NOTIFICATION_CHANNEL_ID || '1259271530991583262';
  playerServerId = process.env.SERVER_ID || '1201647030938910750';
  hybridServerId = process.env.HYBRID_SERVER_ID || '1263520640934084648';

  async handleNotification(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply({
        ephemeral: true,
      });

      const serverOrigin = interaction.guildId;

      const player = await this.prisma.player.findFirst({
        where: { discord_id: interaction.user.id },
      });

      const hybrid = await this.prisma.hybrids.findFirst({
        where: { discord_id: interaction.user.id },
      });

      if (!player && !hybrid) {
        await interaction.editReply('Você não está registrado');
        return;
      }

      const discordCommandName = interaction.commandName;
      let message: string;

      switch (discordCommandName) {
        case 'notificar-online':
          message = 'ficou online!';
          break;
        case 'notificar-offline':
          message = 'ficou offline!';
          break;
      }

      if (
        serverOrigin !== this.playerServerId &&
        serverOrigin !== this.hybridServerId
      ) {
        await interaction.editReply('Comando não permitido nesse servidor!');
        return;
      }

      console.log('serverOrigin', serverOrigin);
      console.log('this.playerServerId', this.playerServerId);
      console.log('this.hybridServerId', this.hybridServerId);

      if (serverOrigin === this.playerServerId) {
        if (!player)
          return await interaction.editReply(
            'Você não está registrado como jogador',
          );
        await this.sendHybridNotification({
          player,
          message,
        });
      }

      if (serverOrigin === this.hybridServerId) {
        if (!hybrid)
          return await interaction.editReply(
            'Você não está registrado como híbrido',
          );
        await this.sendPlayerNotification({
          hybrid,
          message,
        });
      }

      interaction.editReply('Notificação enviada com sucesso!');
    } catch (error) {
      console.error(error);
      await interaction.editReply('Deu erro!');
    }
  }

  async sendHybridNotification({
    player,
    message,
  }: {
    player: Player;
    message: string;
  }) {
    const family = await this.prisma.family.findFirst({
      where: {
        players: {
          some: {
            id: player.id,
          },
        },
      },
      select: {
        hybrid: true,
      },
    });

    const discordMessage = await sendServerMessage({
      channelId: this.hybridNotificationChannelId,
      message: `Olá <@${family.hybrid.discord_id}>, ${player.name} ${message}`,
    });

    return discordMessage;
  }

  async sendPlayerNotification({
    hybrid,
    message,
  }: {
    hybrid: Hybrids;
    message: string;
  }) {
    const playersList = await this.prisma.family.findFirst({
      where: {
        hybrid_id: hybrid.id,
      },
      select: {
        players: true,
      },
    });

    const discordMessage = await sendServerMessage({
      channelId: this.playerNotificationChannelId,
      message: `Olá ${playersList.players.map((player) => `<@${player.discord_id}>`).join(', ')}, ${hybrid.name} ${message}`,
    });

    return discordMessage;
  }
}
