import { BobService } from 'src/modules/bob/bob.service';
import { MinecraftService } from 'src/modules/minecraft/minecraft.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FileService } from 'src/modules/file/file.service';

export class NestServices {
  prisma = new PrismaService();
  bobService = new BobService();
  minecraftService = new MinecraftService(this.prisma, this.bobService);
  fileService = new FileService();
}
