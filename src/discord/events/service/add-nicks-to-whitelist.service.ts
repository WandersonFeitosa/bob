import axios from 'axios';
import { Message } from 'discord.js';
import { discordErrorLog } from 'src/utils/discord-error-log';

export class DiscordAddNickToWhitelistService {
  async handle(message: Message) {
    try {
      if (message.author.bot) return;
      const nick = message.content;
      if (nick.split(' ').length > 1) return;

      const messages = await message.channel.messages.fetch();
      const userMessages = messages.filter((msg) => {
        return (
          msg.author.id === message.author.id &&
          msg.content.split(' ').length === 1
        );
      });

      if (userMessages.size > 1) {
        message.delete();
        return message.channel.send(
          `${message.author}, você já enviou um nick para whitelist, caso tenha enviado errado, apague sua mensagem anterior e envie novamente.`,
        );
      }
      console.log(`Adding nick ${nick} to whitelist`);
      const whiteListAddCommand = `whitelist add ${nick}`;
      const managerUrl = `http://${process.env.MINECRAFT_SERVER_IP}:${process.env.MINECRAFT_MANAGER_PORT}`;
      const response = await axios.post(
        `${managerUrl}/execute-command`,
        {
          command: whiteListAddCommand,
          screenName: process.env.MINECRAFT_SCREEN_NAME,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
          },
        },
      );
      if (response.status !== 200) {
        console.log(response);
        throw new Error('Error adding nick to whitelist');
      }
      message.react('✅');
      return message.channel.send(
        `**${message.content}** adicionado à whitelist`,
      );
    } catch (error) {
      console.log(error);

      message.react('❌');
      message.channel.send(
        `Erro ao adicionar nick **${message.content}** à whitelist automaticamente. Por favor, solicite a um administrador que adicione manualmente.`,
      );
      await discordErrorLog({
        user: message.author,
        channelId: message.channel.id,
        messageId: message.id,
        error,
      });
      return;
    }
  }
}
