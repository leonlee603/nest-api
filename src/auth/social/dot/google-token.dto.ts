import { IsJWT, IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @IsJWT()
  @IsNotEmpty()
  token: string;
}
