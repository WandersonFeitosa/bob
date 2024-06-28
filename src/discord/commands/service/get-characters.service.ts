import { CommandInteraction } from 'discord.js';
import { getFileNamesInFolder } from 'src/utils/getFileNamesInFolder';
import { createCanvas, loadImage } from 'canvas';
import { NestServices } from 'src/discord/nest-services';
const prisma = new NestServices().prisma;

export class DiscordGetCharactersService {
  async handle(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      await interaction.deferReply();

      if (interaction.commandName) {
        const folderPath = `src/images`;
        const requestedFile = interaction.options.getString('nome-do-bixo');
        const bgColor =
          interaction.options.getString('cor-de-fundo') || '#FFFFFF';

        if (requestedFile) {
          const hybrids = await prisma.hybrids.findFirst({
            where: { name: requestedFile },
          });
          const imageFile = `${folderPath}/${hybrids.image}`;
          const image = await loadImage(imageFile);
          const canvas = createCanvas(image.width, image.height);
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(image, 0, 0);

          const canvasWidth = 280;
          const canvasHeight = 300;
          const heartImage = await loadImage(`${folderPath}/heart.png`);
          const brokenHeartImage = await loadImage(
            `${folderPath}/broken-heart.png`,
          );
          const heartSize = 30;
          const margin = 10;
          const totalHeartsWidth = 4 * heartSize + 3 * margin;
          const startX = (canvasWidth - totalHeartsWidth) / 2;

          for (let i = 0; i < 4; i++) {
            if (i < hybrids.lifes) {
              ctx.drawImage(
                heartImage,
                startX + i * (heartSize + margin),
                canvasHeight - heartSize - margin,
                heartSize,
                heartSize,
              );
            } else {
              ctx.drawImage(
                brokenHeartImage,
                startX + i * (heartSize + margin),
                canvasHeight - heartSize - margin,
                heartSize,
                heartSize,
              );
            }
          }

          const buffer = canvas.toBuffer();
          await interaction.editReply({ files: [{ attachment: buffer }] });
        } else {
          const hybrids = await prisma.hybrids.findMany({
            orderBy: { create_at: 'asc' },
          });
          const numRows = Math.ceil(hybrids.length / 4);
          console.log(numRows);
          const imageWidth = 280;
          const imageHeight = 300;
          const canvasWidth = 4 * imageWidth;
          const canvasHeight = numRows * imageHeight;
          const canvas = createCanvas(canvasWidth, canvasHeight);
          const ctx = canvas.getContext('2d');

          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);

          const heartImage = await loadImage(`${folderPath}/heart.png`);
          const brokenHeartImage = await loadImage(
            `${folderPath}/broken-heart.png`,
          );
          const heartSize = 30;
          const margin = 10;
          const totalHeartsWidth = 4 * heartSize + 3 * margin;

          for (let i = 0; i < hybrids.length; i++) {
            const hybrid = hybrids[i];
            console.log(hybrid);
            const row = Math.floor(i / 4);
            const columns = i % 4;
            const startX = columns * imageWidth;
            const startY = row * imageHeight;

            const imageFile = `${folderPath}/${hybrid.image}`;
            const image = await loadImage(imageFile);

            ctx.drawImage(image, startX, startY);

            const heartStartX = startX + (imageWidth - totalHeartsWidth) / 2;
            const heartStartY = startY + imageHeight - heartSize - margin;

            for (let i = 0; i < 4; i++) {
              if (i < hybrid.lifes) {
                ctx.drawImage(
                  heartImage,
                  heartStartX + i * (heartSize + margin),
                  heartStartY,
                  heartSize,
                  heartSize,
                );
              } else {
                ctx.drawImage(
                  brokenHeartImage,
                  heartStartX + i * (heartSize + margin),
                  heartStartY,
                  heartSize,
                  heartSize,
                );
              }
            }
          }

          const buffer = canvas.toBuffer();
          await interaction.editReply({ files: [{ attachment: buffer }] });
        }
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply('Deu erro!');
    }
  }
}
