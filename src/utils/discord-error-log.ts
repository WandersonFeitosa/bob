import { User } from 'discord.js';
import { sendServerMessage } from './send-message-on-channel';

export async function discordErrorLog({
  user,
  channelId,
  authorId,
  messageId,
  error,
}: {
  user?: User;
  channelId?: string;
  authorId?: string;
  messageId?: string;
  error: Error;
}) {
  await sendServerMessage({
    channelId: process.env.SERVER_LOG_CHANNEL_ID,
    message: `
        \`\`\`
Erro ao adicionar nick à whitelist automaticamente
Nick: ${user.tag}
Channel: ${channelId} 
Author: ${authorId}
Message: ${messageId}
Erro: ${error.message}
Stack: ${error.stack}  
        \`\`\`
        `,
  });
}
