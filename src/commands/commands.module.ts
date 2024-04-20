import { BobService } from 'src/modules/bob/bob.service';
import { Commands } from './commands.controller';
import { MinecraftService } from 'src/modules/minecraft/minecraft.service';
import { PrismaService } from 'src/prisma/prisma.service';

interface Command {
  name: string;
  description: string;
  function: (...args: any[]) => any;
  options?: CommandOptions[];
}
interface CommandOptions {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  choices?: any[];
  options?: any[];
}

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

export { commandsObject, commands, prisma, bobService, minecraftService };
