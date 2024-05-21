import {
  AttachmentBuilder,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { NestServices } from 'src/discord/nest-services';
import { sendServerMessage } from 'src/utils/send-message-on-channel';
export class DiscordArtsApproveService {
  private prismaService = new NestServices().prisma;
  async handle(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    if (user.bot) return;
    try {
      if (reaction.partial) {
        try {
          await reaction.fetch();
        } catch (error) {
          console.error(
            'Something went wrong when fetching the message:',
            error,
          );
          return;
        }
      }

      const messageId = reaction.message.id;
      const emojiName = reaction.emoji.name;

      if (emojiName !== '✅' && emojiName !== '❌') return;
      const count = reaction.message.reactions.cache.get(emojiName).count;

      if (count !== 3) return;

      if (emojiName === '✅') {
        await this.handleApprove(messageId);
      }

      if (emojiName === '❌') {
        await this.handleReject(messageId);
      }

      await reaction.message.delete();
    } catch (error) {
      console.log(error);
    }
  }

  async handleApprove(messageId: string) {
    try {
      const art = await this.prismaService.tcsmpArts.findFirst({
        where: {
          messageId,
          status: 'PENDING',
        },
      });

      if (!art) return;

      await this.prismaService.tcsmpArts.update({
        where: {
          id: art.id,
        },
        data: {
          status: 'APPROVED',
        },
      });

      const artsChannelId = process.env.ARTS_PANNEL_CHANNEL_ID;

      const message = `**${art.name}** enviada por <@${art.uploadedBy}>`;

      const attachmentUrl = art.image;
      const donwloadAttachment = await fetch(attachmentUrl);
      const arrayBuffer = await donwloadAttachment.arrayBuffer();
      const attachmentBuffer = Buffer.from(arrayBuffer);

      await sendServerMessage({
        channelId: artsChannelId,
        message,
        files: [new AttachmentBuilder(attachmentBuffer)],
      });
    } catch (error) {
      console.log(error);
    }
  }

  async handleReject(messageId: string) {
    try {
      const rejectedArt = await this.prismaService.tcsmpArts.update({
        where: {
          messageId,
        },
        data: {
          status: 'REJECTED',
        },
      });
      sendServerMessage({
        channelId: process.env.APPROVE_ARTS_CHANNEL_ID,
        message: `A arte enviada por <@${rejectedArt.uploadedBy}> foi rejeitada`,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
