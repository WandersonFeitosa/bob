import { client } from 'src/main';

export async function sendServerMessage({
  channelId,
  message,
}: {
  channelId: string;
  message: string;
}) {
  try {
    const channel: any = client.channels.cache.get(channelId);
    await channel.send(message);
    return;
  } catch (error: any) {
    console.log(error);
    throw new Error('Error sending message');
  }
}
