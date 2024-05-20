import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('/v1/file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    return await this.fileService.uploadFile({
      name: file.originalname,
      buffer: file.buffer,
    });
  }
}
