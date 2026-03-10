import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  Matches,
  MinLength,
  IsUrl,
  IsJSON,
} from 'class-validator';

export class CreateTagDto {
  // The name of the tag
  @ApiProperty({
    description: 'The name of the tag',
    example: 'Tag 1',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @IsNotEmpty()
  name: string;

  // The slug of the tag
  @ApiProperty({
    description: 'The slug of the tag',
    example: 'tag-1',
  })
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'Slug must be in lowercase and contain only letters and numbers. For example: my-first-post',
  })
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @MaxLength(256)
  @IsNotEmpty()
  slug: string;

  // The description of the tag
  @ApiProperty({
    description: 'The description of the tag',
    example: 'This is the description of the tag',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  // The schema of the tag
  @ApiProperty({
    description: 'The schema of the tag',
    example: '{"key": "value"}',
    required: false,
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  // The featured image URL of the tag
  @ApiProperty({
    description: 'The featured image URL of the tag',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(1024)
  featuredImageUrl?: string;
}
