import {
  CategoryChannelResolvable,
  ChannelType,
  GuildChannelCreateOptions,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { client } from 'src/main';
import { sendServerMessage } from 'src/utils/send-message-on-channel';
import { v4 as uuidv4 } from 'uuid';
export class DiscordGenerateTicketService {
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

      const emojiName = reaction.emoji.name;
      await reaction.users.remove(user.id);

      if (emojiName !== '🎟️') return;

      await reaction.message.react('🎟️');

      const ticketCategoryId = process.env.TICKET_CATEGORY_ID;

      const category = client.channels.cache.get(
        ticketCategoryId,
      ) as CategoryChannelResolvable;

      const uuid = uuidv4();

      const channelOptions: GuildChannelCreateOptions = {
        name: `ticket-${user.username}-${uuid}`,
        type: ChannelType.GuildText,
        parent: category,
        permissionOverwrites: [
          {
            id: user.id,
            allow: ['ViewChannel'],
          },
          {
            id: reaction.message.guild.roles.everyone,
            deny: ['ViewChannel'],
          },
        ],
      };

      const channel =
        await reaction.message.guild.channels.create(channelOptions);

      const adminRoles = process.env.ADMIN_ROLES
        ? process.env.ADMIN_ROLES.split(',')
        : [];

      await sendServerMessage({
        channelId: channel.id,
        message: `${adminRoles.map((role) => `<@&${role}>`).join(' ')}\n Olá <@${user.id}>, o seu ticket foi criado, dê uma descrição do que você deseja que em breve algum administrador te responderá, esse canal é exclusivo para você e para a administração.`,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
