import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { DiscordArtsApproveService } from './service/arts-approve.service';
export class DiscordEventsController {
  artAprroveChannelId = process.env.APPROVE_ARTS_CHANNEL_ID;
  async reactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    if (reaction.message.channel.id === this.artAprroveChannelId) {
      return await new DiscordArtsApproveService().handle(reaction, user);
    }
  }
}
