import { BobService } from 'src/modules/bob/bob.service';
import { Commands } from './commands.controller';
import { MinecraftService } from 'src/modules/minecraft/minecraft.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from 'src/modules/file/file.service';
import {
  ApplicationCommandOptionType,
  CommandInteractionOption,
} from 'discord.js';

interface Command extends Partial<CommandInteractionOption> {
  type?: ApplicationCommandOptionType;
  description: string;
  function: Function;
  options?: CommandOptions[];
}

type CommandOptions = Omit<Command, 'function'> & {
  type: ApplicationCommandOptionType;
  name: string;
  required?: boolean;
};

const commands: Command[] = [
  {
    name: 'ping',
    description: 'Pong',
    function: new Commands().ping,
  },
  {
    name: 'ana',
    description: 'Ana',
    function: new Commands().ana,
  },
  {
    name: 'ligar-servidor',
    description: 'Inicia o servidor caso ele esteja offline',
    function: new Commands().startServer,
  },
  {
    name: 'enviar-mensagem',
    description: 'Envia uma mensagem para um canal',
    function: new Commands().sendServerMessage,
    options: [
      {
        name: 'mensagem',
        description: 'Mensagem a ser enviada',
        type: 3,
        required: true,
      },
      {
        name: 'canal',
        description: 'Canal para enviar a mensagem',
        type: 7,
        required: true,
      },
    ],
  },
  {
    name: 'backup',
    description: 'Inicia um backup do servidor',
    function: new Commands().startBackup,
  },
  {
    name: 'status',
    description: 'Mostra o status do servidor',
    function: new Commands().serverStatus,
  },
  {
    name: 'dummy',
    description: 'Comando de teste',
    function: new Commands().dummy,
  },
  {
    name: 'enviar-arte',
    description: 'Envie sua arte para o servidor',
    function: new Commands().submitArt,
    options: [
      {
        name: 'titulo',
        description: 'Título da arte',
        type: 3,
        required: true,
      },
      {
        name: 'imagem',
        description: 'Arquivo da arte',
        type: 11,
        required: true,
      },
    ],
  },
];

function buildCommandsObject(commands: Command[]): Record<string, Command> {
  const commandsObject = {};
  commands.forEach((command) => {
    commandsObject[command.name] = command;
  });
  return commandsObject;
}

const commandsObject = buildCommandsObject(commands);

const prisma = new PrismaService();
const bobService = new BobService();
const minecraftService = new MinecraftService(prisma, bobService);
const fileService = new FileService();

export {
  commandsObject,
  commands,
  prisma,
  bobService,
  minecraftService,
  fileService,
};
