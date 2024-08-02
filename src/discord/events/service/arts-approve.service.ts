import { TcsmpArt } from '@prisma/client';
import {
  AttachmentBuilder,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { nestServices } from 'src/discord/nest-services';
import { client } from 'src/main';
import { createChannel } from 'src/utils/create-channel';
import { sendServerMessage } from 'src/utils/send-message-on-channel';
export class DiscordArtsApproveService {
  private prismaService = nestServices.prisma;
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

  async handleAuthorAuthorize(
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

      const emojiName = reaction.emoji.name;

      console.log('emojiName', emojiName);

      if (emojiName !== '✅' && emojiName !== '❌') return;

      if (emojiName === '✅') {
        console.log('Author approve');
        await this.handleAuthorApprove({
          reaction: reaction as MessageReaction,
          user: user as User,
        });
      }

      if (emojiName === '❌') {
        await this.handleAuthorReject({
          reaction: reaction as MessageReaction,
          user: user as User,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  async handleApprove(messageId: string) {
    try {
      console.log('[Discord.Events] Approve', messageId);
      const art = await this.prismaService.tcsmpArt.findFirst({
        where: {
          messageId,
          status: 'PENDING',
        },
      });

      if (!art) return;

      if (art.author !== art.uploadedBy) {
        return this.handleAuthorAuthorizationGenerate(art);
      }

      await this.prismaService.tcsmpArt.update({
        where: {
          id: art.id,
        },
        data: {
          status: 'APPROVED',
        },
      });

      const artsChannelId = process.env.ARTS_PANNEL_CHANNEL_ID;

      const message = `**${art.name}** de <@${art.author}>`;

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
      const rejectedArt = await this.prismaService.tcsmpArt.update({
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

  async handleAuthorAuthorizationGenerate(art: TcsmpArt) {
    const author = art.author;
    const user = await client.users.fetch(author);

    const sanitizedTitle = art.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const authorizeChannel = await createChannel({
      name: sanitizedTitle,
      categoryId: process.env.AUTHOR_AUTHORIZE_CATEGORY_ID,
      serverId: process.env.SERVER_ID,
      permissions: [
        {
          id: user.id,
          allow: ['ViewChannel'],
        },
      ],
    });

    const authorizeMessage = `Olá <@${author}>, sua arte **${art.name}** foi enviada por <@${art.uploadedBy}> e precisa de sua autorização para ser aprovada e colocada no <#${process.env.ARTS_PANNEL_CHANNEL_ID}>`;

    const attachmentUrl = art.image;
    const donwloadAttachment = await fetch(attachmentUrl);
    const arrayBuffer = await donwloadAttachment.arrayBuffer();
    const attachmentBuffer = Buffer.from(arrayBuffer);

    const userAuthorizeMessage = await sendServerMessage({
      channelId: authorizeChannel.id,
      message: authorizeMessage,
      files: [new AttachmentBuilder(attachmentBuffer)],
    });

    console.log('userAuthorizeMessage', userAuthorizeMessage);

    await userAuthorizeMessage.react('✅');
    await userAuthorizeMessage.react('❌');

    await this.prismaService.tcsmpArt.update({
      where: {
        id: art.id,
      },
      data: {
        status: 'PENDING AUTHOR',
        messageId: userAuthorizeMessage.id,
      },
    });
  }

  async handleAuthorApprove({
    reaction,
    user,
  }: {
    reaction: MessageReaction;
    user: User;
  }) {
    try {
      const art = await this.prismaService.tcsmpArt.findFirst({
        where: {
          messageId: reaction.message.id,
          status: 'PENDING AUTHOR',
        },
      });

      console.log('art', art);

      if (!art || art.author !== user.id) return;

      await this.prismaService.tcsmpArt.update({
        where: {
          id: art.id,
        },
        data: {
          status: 'APPROVED',
        },
      });

      const artsChannelId = process.env.ARTS_PANNEL_CHANNEL_ID;

      const message = `**${art.name}** de <@${art.author}>`;

      const attachmentUrl = art.image;
      const donwloadAttachment = await fetch(attachmentUrl);
      const arrayBuffer = await donwloadAttachment.arrayBuffer();
      const attachmentBuffer = Buffer.from(arrayBuffer);

      await sendServerMessage({
        channelId: artsChannelId,
        message,
        files: [new AttachmentBuilder(attachmentBuffer)],
      });

      await reaction.message.channel.delete();
    } catch (error) {
      console.log(error);
    }
  }
  async handleAuthorReject({
    reaction,
    user,
  }: {
    reaction: MessageReaction;
    user: User;
  }) {
    try {
      const art = await this.prismaService.tcsmpArt.update({
        where: {
          messageId: reaction.message.id,
        },
        data: {
          status: 'REJECTED',
        },
      });

      if (!art || art.author !== user.id) return;

      await reaction.message.channel.delete();
    } catch (error) {
      console.log(error);
    }
  }
}
