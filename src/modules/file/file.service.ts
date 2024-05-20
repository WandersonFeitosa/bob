import { HttpException, Injectable } from '@nestjs/common';
import { File, Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private readonly storage: Storage;
  private readonly bucketName: string;
  constructor() {
    this.storage = new Storage({
      projectId: process.env.PROJECT_ID
    });
    this.bucketName = process.env.BUCKET_NAME;
  }

  async uploadFile({
    name,
    buffer,
  }: {
    name: string;
    buffer: Buffer;
  }): Promise<File> {
    try {
      const uuid = uuidv4();
      const file = this.storage.bucket(this.bucketName).file(uuid + '-' + name);
      await file.save(buffer);
      return file;
    } catch (error) {
      throw new HttpException(error.message, 500);
    }
  }
}
