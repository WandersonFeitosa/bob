import { IsString } from 'class-validator';

export class GetInstancesDTO {
  @IsString()
  region: string;
}
