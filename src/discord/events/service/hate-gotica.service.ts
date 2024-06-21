import {
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  User,
} from 'discord.js';
import { sendServerMessage } from 'src/utils/send-message-on-channel';

export class DiscordHateGoticaService {
  activeLoop = true;
  async handle(
    reaction: MessageReaction | PartialMessageReaction,
    user: User | PartialUser,
  ) {
    const goticaID = process.env.GOTICA_ID || '500908554752884737';

    if (reaction.partial) {
      try {
        await reaction.fetch();
      } catch (error) {
        console.error('Something went wrong when fetching the message:', error);
        return;
      }
    }

    if (user.id !== goticaID) return;

    const channel = reaction.message.channel;

    const sentMessage = await sendServerMessage({
      channelId: channel.id,
      message: `Vai tomar no cu <@${goticaID}> 🖕`,
    });

    setTimeout(() => {
      sentMessage.delete();
    }, 5000);
  }
}
