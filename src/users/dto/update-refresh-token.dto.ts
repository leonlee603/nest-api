import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRefreshTokenDto {
  // Refresh token hash
  @ApiProperty({
    description:
      'The refresh token hash of the user, hashed version of refresh token is saved when user signs in',
    example: '1234567890',
  })
  @IsString()
  @IsOptional()
  refreshTokenHash?: string;
}
