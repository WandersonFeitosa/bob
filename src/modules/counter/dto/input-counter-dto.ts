import { IsEmail, IsNumber, IsString } from 'class-validator';

export class RegisterCountDTO {
  @IsNumber()
  count: number;
}

export class RegisterMultiplier {
  @IsString()
  username: string;
  @IsString()
  email: string;
  @IsString()
  image: string;
}
