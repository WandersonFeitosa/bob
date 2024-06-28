import { Message } from 'discord.js';

export class DiscordBubaCloneService {
  activeLoop = true;
  async handle(message: Message) {
    return    
    try {
      if (message.content) {
        if (message.content === 'para') {
          this.activeLoop = false;
        }
        if (message.content === 'volta') {
          this.activeLoop = true;
        }
        if (!this.activeLoop) return;
        message.channel.send(message.content);
      }
      if (message.attachments) {
        message.attachments.forEach((attachment) => {
          message.channel.send(attachment.url);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}
