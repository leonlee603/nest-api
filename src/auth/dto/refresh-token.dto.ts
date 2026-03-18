import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  // Refresh token hash
  @ApiProperty({
    description:
      'The refresh token hash of the user, hashed version of refresh token is saved when user signs in',
    example: '1234567890',
  })
  @IsNotEmpty()
  @IsJWT()
  refreshToken: string;
}
