import { CommandInteraction } from 'discord.js';
import { nestServices } from 'src/discord/nest-services';

export class DiscordPlayersService {
  prisma = nestServices.prisma;

  async handleRegisterPlayer(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply({
        ephemeral: true,
      });

      const name = interaction.options.getString('nome');
      const discord_id = interaction.user.id;

      const playerData = {
        name,
        discord_id,
      };

      await this.registerPlayer(playerData);

      await interaction.editReply('Jogador registrado com sucesso!');
    } catch (error) {
      console.error(error);
      await interaction.editReply('Deu erro!');
    }
  }

  async registerPlayer(playerData: { name: string; discord_id: string }) {
    return await this.prisma.player.create({
      data: playerData,
    });
  }

  async handleBindPlayerToFamily(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply({
        ephemeral: true,
      });

      const playerId = interaction.user.id;
      const hyrbidId = interaction.options.getString('hibrido');

      await this.bindPlayerToFamily(playerId, hyrbidId);

      await interaction.editReply('Vinculado a família com sucesso!');
    } catch (error) {
      console.error(error);
      if (
        error.message === 'Você não está registrado como jogador' ||
        error.message === 'Híbrido não encontrado'
      ) {
        await interaction.editReply(error.message);
        return;
      }
      await interaction.editReply('Deu erro!');
    }
  }

  async bindPlayerToFamily(playerDiscordId: string, hyrbidId: string) {
    const playerExists = await this.prisma.player.findUnique({
      where: { discord_id: playerDiscordId },
    });

    if (!playerExists) {
      throw new Error(`Você não está registrado como jogador`);
    }

    const hybridExists = await this.prisma.hybrids.findUnique({
      where: { id: hyrbidId },
    });

    if (!hybridExists) {
      throw new Error(`Híbrido não encontrado`);
    }

    const family = await this.prisma.family.findUnique({
      where: { hybrid_id: hyrbidId },
    });

    if (!family) {
      return await this.prisma.family.create({
        data: {
          hybrid_id: hyrbidId,
          players: {
            connect: {
              discord_id: playerDiscordId,
            },
          },
        },
      });
    }
    return await this.prisma.family.update({
      where: {
        hybrid_id: hyrbidId,
      },
      data: {
        players: {
          connect: {
            discord_id: playerDiscordId,
          },
        },
      },
    });
  }
}
