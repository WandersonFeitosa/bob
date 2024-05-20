import { IsString } from 'class-validator';

export class UploadFileDTO {
  @IsString()
  originalname: string;
}
