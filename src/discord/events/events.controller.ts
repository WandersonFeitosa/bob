import {
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { DiscordArtsApproveService } from './service/arts-approve.service';
import { DiscordAddNickToWhitelistService } from './service/add-nicks-to-whitelist.service';
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
  }

  async messageCreate(message: Message) {
    if (message.author.bot) return;
    
    if (message.channel.id === this.nicksWhitelistChannelId) {
      return await new DiscordAddNickToWhitelistService().handle(message);
    }

    return;
  }
}
