import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  REST,
  Routes,
} from 'discord.js';
import { commands, commandsObject } from './commands/commands.module';
import { ValidationPipe } from '@nestjs/common';

export const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(token);

async function startDiscordConnection() {
  await rest.put(Routes.applicationCommands(client_id), {
    body: commands.map((command) => {
      return {
        name: command.name,
        description: command.description,
        options: command.options,
      };
    }),
  });

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isChatInputCommand()) return;
    commandsObject[interaction.commandName].function(interaction);
  });

  client.login(token);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT || 3000);
  startDiscordConnection();
}
bootstrap();
