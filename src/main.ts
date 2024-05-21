import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Partials,
  REST,
  Routes,
} from 'discord.js';
import { commands, commandsObject } from './discord/commands/commands.module';
import { ValidationPipe } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DiscordEventsModule } from './discord/events/events.module';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
const token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;

const rest = new REST({ version: '10' }).setToken(token);

async function startDiscordConnection() {
  console.log('Updating Discord commands...');

  await rest.put(Routes.applicationCommands(client_id), {
    body: commands.map((command) => {
      return {
        name: command.name,
        description: command.description,
        options: command.options,
      };
    }),
  });

  console.log('Discord commands updated');

  console.log('Starting Discord connection...');
  await client.login(token);
  console.log('Discord connection started');

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  });

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;
      return commandsObject[interaction.commandName].function(interaction);
    } catch (error) {
      console.log(error);
    }
  });

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    await new DiscordEventsModule().reactionAdd(reaction, user);
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });
  await app.listen(process.env.PORT || 3000);
  console.log(`Server started on port ${process.env.PORT || 3000}`);
  await startDiscordConnection();
}
bootstrap();
