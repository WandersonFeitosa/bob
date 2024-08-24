import { BobService } from 'src/modules/bob/bob.service';
import { MinecraftService } from 'src/modules/minecraft/minecraft.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from 'src/modules/file/file.service';
import { ManagerProxy } from 'src/infrastructure/proxy/manager/manager.proxy';

class NestServices {
  prisma = new PrismaService();
  bobService = new BobService();
  managerProxy = new ManagerProxy();
  minecraftService = new MinecraftService(
    this.prisma,
    this.bobService,
    this.managerProxy,
  );
  fileService = new FileService();
}

export const nestServices = new NestServices();
