import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class GoogleTokenDto {
  @ApiProperty({
    description: 'The Google token sent by the user',
    example: 'google-token',
  })
  @IsJWT()
  @IsNotEmpty()
  token: string;
}
