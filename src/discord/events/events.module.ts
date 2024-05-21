import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { DiscordEventsController } from './events.controller';

export class DiscordEventsModule {
  async reactionAdd(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    return new DiscordEventsController().reactionAdd(reaction, user);
  }
}
