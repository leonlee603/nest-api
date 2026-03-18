import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  // Refresh token
  @ApiProperty({
    description:
      'The refresh token of the user, used to generate new access token',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
