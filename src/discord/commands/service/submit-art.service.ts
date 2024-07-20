import { AttachmentBuilder, ClientUser, CommandInteraction } from 'discord.js';
import { sendServerMessage } from 'src/utils/send-message-on-channel';
import { NestServices } from 'src/discord/nest-services';

export class DiscordSubmitArtService {
  private prismaService = new NestServices().prisma;
  private fileService = new NestServices().fileService;

  async handle(interaction: CommandInteraction) {
    try {
      await interaction.deferReply({
        ephemeral: true,
      });
      if (!interaction.isChatInputCommand()) return;
      const user = interaction.user;
      const artTitle = interaction.options.getString('titulo');
      const attachment = interaction.options.getAttachment('imagem');
      const author = interaction.options.getUser('autor') as ClientUser;

      if (!attachment.contentType.includes('image')) {
        return interaction.editReply({
          content: 'O arquivo enviado não é uma imagem',
        });
      }

      const attachmentUrl = attachment.url;
      const donwloadAttachment = await fetch(attachmentUrl);
      const arrayBuffer = await donwloadAttachment.arrayBuffer();
      const attachmentBuffer = Buffer.from(arrayBuffer);

      const uploadResult = await this.fileService.uploadFile({
        name: attachment.name,
        buffer: attachmentBuffer,
      });

      const url = uploadResult.metadata.mediaLink;

      const adminRoles = process.env.ADMIN_ROLES.split(',');

      const channelId = process.env.APPROVE_ARTS_CHANNEL_ID;
      const message = `**${adminRoles.map((role) => `<@&${role}>`).join(' ')}**\n**${artTitle}** feito por <@${author.id}> e enviado por <@${user.id}>`;
      const sentMessage = await sendServerMessage({
        channelId,
        message,
        files: [new AttachmentBuilder(attachmentBuffer)],
      });

      const messageId = sentMessage.id;

      await this.prismaService.tcsmpArt.create({
        data: {
          name: artTitle,
          image: url,
          author: author ? author.id : user.id,
          uploadedBy: user.id,
          status: 'PENDING',
          messageId,
        },
      });

      await sentMessage.react('✅');
      await sentMessage.react('❌');

      interaction.editReply({
        content: `<@${user.id}> Arte enviada com sucesso`,
      });

      return;
    } catch (error) {
      console.log(error);
      interaction.editReply({
        content: 'Ocorreu um erro ao enviar a arte',
      });
    }
  }
}
