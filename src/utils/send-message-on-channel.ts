import { AttachmentBuilder } from 'discord.js';
import { client } from 'src/main';

export async function sendServerMessage({
  channelId,
  message,
  files,
}: {
  channelId: string;
  message: string;
  files?: AttachmentBuilder[];
}) {
  try {
    const channel: any = client.channels.cache.get(channelId);
    if (!channel) {
      throw new Error('Channel not found');
    }

    return await channel.send({
      content: message,
      files,
    });
  } catch (error: any) {
    console.log(error);
    throw new Error('Error sending message');
  }
}
