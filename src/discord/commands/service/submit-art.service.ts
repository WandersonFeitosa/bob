import { AttachmentBuilder, CommandInteraction } from 'discord.js';
import { fileService, prisma } from '../commands.module';
import { sendServerMessage } from 'src/utils/send-message-on-channel';

export class DiscordSubmitArtService {
  async handle(interaction: CommandInteraction) {
    try {
      if (!interaction.isChatInputCommand()) return;
      const user = interaction.user;
      const artTitle = interaction.options.getString('titulo');
      const attachment = interaction.options.getAttachment('imagem');

      if (!attachment.contentType.includes('image')) {
        return interaction.reply({
          content: 'O arquivo enviado não é uma imagem',
          ephemeral: true,
        });
      }

      interaction.reply({
        content: 'Sua arte foi enviada e está em processamento.',
        ephemeral: true,
      });

      const attachmentUrl = attachment.url;
      const donwloadAttachment = await fetch(attachmentUrl);
      const arrayBuffer = await donwloadAttachment.arrayBuffer();
      const attachmentBuffer = Buffer.from(arrayBuffer);

      const uploadResult = await fileService.uploadFile({
        name: attachment.name,
        buffer: attachmentBuffer,
      });

      const url = uploadResult.metadata.mediaLink;

      const adminRoles = process.env.ADMIN_ROLES.split(',');

      const channelId = process.env.APPROVE_ARTS_CHANNEL_ID;
      const message = `**${adminRoles.map((role) => `<@&${role}>`).join(' ')}**\n**${artTitle}** enviado por <@${user.id}>`;
      const sentMessage = await sendServerMessage({
        channelId,
        message,
        files: [new AttachmentBuilder(attachmentBuffer)],
      });

      const messageId = sentMessage.id;

      await prisma.tcsmpArts.create({
        data: {
          name: artTitle,
          image: url,
          uploadedBy: user.id,
          status: 'PENDING',
          messageId,
        },
      });

      await sentMessage.react('✅');
      await sentMessage.react('❌');

      interaction.followUp({
        content: `<@${user.id}> Arte enviada com sucesso`,
        ephemeral: true,
      });

      return;
    } catch (error) {
      console.log(error);
      const status = interaction.replied ? 'followUp' : 'reply';
      interaction[status]({
        content: 'Ocorreu um erro ao enviar a arte',
        ephemeral: true,
      });
    }
  }
}
