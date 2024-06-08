import {
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { DiscordArtsApproveService } from './service/arts-approve.service';
import { DiscordAddNickToWhitelistService } from './service/add-nicks-to-whitelist.service';
import { DiscordBubaCloneService } from './service/buba-clone.service';
import { DiscordGenerateTicketService } from './service/genreate-ticket.service';
export class DiscordEventsController {
  artAprroveChannelId = process.env.APPROVE_ARTS_CHANNEL_ID;
  nicksWhitelistChannelId = process.env.NICKS_CHANNEL_ID;
  async reactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    if (reaction.message.channel.id === this.artAprroveChannelId) {
      return await new DiscordArtsApproveService().handle(reaction, user);
    }
    if (reaction.message.id === process.env.TICKET_MESSAGE_ID) {
      return new DiscordGenerateTicketService().handle(reaction, user);
    }
  }

  async messageCreate(message: Message) {
    if (message.author.bot) return;

    if (
      message.author.id === process.env.BUBA_ID &&
      process.env.NODE_ENV === 'develop'
    ) {
      return new DiscordBubaCloneService().handle(message);
    }

    if (message.channel.id === this.nicksWhitelistChannelId) {
      return await new DiscordAddNickToWhitelistService().handle(message);
    }

    return;
  }
}
