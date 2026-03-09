import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  // The key of the post's meta option
  @ApiProperty({
    description: "The key of the post's meta option",
    example: 'key1',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @IsNotEmpty()
  key: string;

  // The value of the post's meta option
  @ApiProperty({
    description: "The value of the post's meta option",
    example: 'value1',
  })
  @IsNotEmpty()
  value: any;
}
