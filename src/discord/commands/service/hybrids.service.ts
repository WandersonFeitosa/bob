import { CommandInteraction } from 'discord.js';
import { createCanvas, loadImage } from 'canvas';
import { NestServices } from 'src/discord/nest-services';
import { Hybrids } from '@prisma/client';

export class DiscordHybridsService {
  prisma = new NestServices().prisma;
  folderPath = `src/images`;
  hybridWidth = 280;
  hybridHeight = 300;

  async generateHybridArt(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply();

      const requestedFile = interaction.options.getString('nome-do-hibrido');
      const bgColor = interaction.options.getString('cor-de-fundo');

      if (requestedFile) {
        const hybrid = await this.prisma.hybrids.findFirst({
          where: { name: requestedFile },
        });

        const buffer = await this.generateHybridImage({
          hybrid,
          bgColor,
        });

        return await interaction.editReply({ files: [{ attachment: buffer }] });
      }

      const hybrids = await this.prisma.hybrids.findMany({
        orderBy: { create_at: 'asc' },
      });

      const buffer = await this.generateHybridGroupImage(hybrids);

      await interaction.editReply({ files: [{ attachment: buffer }] });
    } catch (error) {
      console.error(error);
      await interaction.editReply('Deu erro!');
    }
  }

  async generateHybridImage({
    hybrid,
    bgColor,
  }: {
    hybrid: Hybrids;
    bgColor?: string;
  }): Promise<Buffer> {
    const imageFile = `${this.folderPath}/${hybrid.image}`;
    const image = await loadImage(imageFile);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = bgColor || '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    const heartImage = await loadImage(`${this.folderPath}/heart.png`);
    const brokenHeartImage = await loadImage(
      `${this.folderPath}/broken-heart.png`,
    );
    const heartSize = 30;
    const margin = 10;
    const totalHeartsWidth = 4 * heartSize + 3 * margin;
    const startX = (this.hybridWidth - totalHeartsWidth) / 2;

    for (let i = 0; i < 4; i++) {
      if (i < hybrid.lifes) {
        ctx.drawImage(
          heartImage,
          startX + i * (heartSize + margin),
          this.hybridWidth - heartSize - margin,
          heartSize,
          heartSize,
        );
      } else {
        ctx.drawImage(
          brokenHeartImage,
          startX + i * (heartSize + margin),
          this.hybridWidth - heartSize - margin,
          heartSize,
          heartSize,
        );
      }
    }

    const buffer = canvas.toBuffer();

    return buffer;
  }

  public async generateHybridGroupImage(hybrids: Hybrids[]): Promise<Buffer> {
    const numRows = Math.ceil(hybrids.length / 4);

    const canvasWidth = 4 * this.hybridWidth;
    const canvasHeight = numRows * this.hybridHeight;
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    for (let i = 0; i < hybrids.length; i++) {
      const hybrid = hybrids[i];
      const row = Math.floor(i / 4);
      const columns = i % 4;
      const startX = columns * this.hybridWidth;
      const startY = row * this.hybridHeight;

      const hybridBuffer = await this.generateHybridImage({ hybrid });

      const hybridImage = await loadImage(hybridBuffer);
      ctx.drawImage(hybridImage, startX, startY);
    }

    const buffer = canvas.toBuffer();
    return buffer;
  }

  async handleRegisterHybrid(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply({
        ephemeral: true,
      });

      const name = interaction.options.getString('nome');
      const animal = interaction.options.getString('animal');
      const image = interaction.options.getString('imagem');
      const lifes = interaction.options.getInteger('vidas');
      const hybridUser = interaction.options.getUser('usuario');

      const hybridData = {
        name,
        animal,
        discord_id: hybridUser.id,
        image,
        lifes,
      };

      await this.registerHybrid(hybridData);

      await interaction.editReply('Híbrido registrado com sucesso!');
    } catch (error) {
      console.error(error);
      await interaction.editReply('Deu erro!');
    }
  }

  async registerHybrid(hybridData: {
    name: string;
    animal: string;
    discord_id?: string;
    image?: string;
    lifes?: number;
  }) {
    return await this.prisma.hybrids.create({
      data: hybridData,
    });
  }

  async handleListHybrids(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply({
        ephemeral: true,
      });

      const hybrids = await this.prisma.hybrids.findMany({
        orderBy: { create_at: 'asc' },
      });

      let hybridsMessage: string = '';

      for (const hybrid of hybrids) {
        hybridsMessage += `**Nome:** ${hybrid.name}\n`;
        hybridsMessage += `**Animal:** ${hybrid.animal}\n`;
        hybridsMessage += `**ID:**\n`;
        hybridsMessage += '```' + hybrid.id + '```\n';
        hybridsMessage += '----------------------\n\n';
      }

      await interaction.editReply(hybridsMessage);
    } catch (error) {
      console.error(error);
      await interaction.editReply('Deu erro!');
    }
  }
}
