import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  Matches,
  IsJSON,
  IsUrl,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { PostType } from '../enums/postType.enum';
import { PostStatus } from '../enums/postStatus.enum';
import { Transform, Type } from 'class-transformer';
import { CreateMetaOptionDto } from '../../meta-options/dto/create-meta-option.dto';
import { CreateTagDto } from '../../tags/dto/create-tag.dto';

export class CreatePostDto {
  // Post type (post, page, story, series)
  @ApiProperty({
    description: 'The type of the post (post, page, story, series)',
    example: PostType.POST,
    enum: PostType,
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  // Post status (draft, scheduled, review, published)
  @ApiProperty({
    description: 'The status of the post (draft, scheduled, review, published)',
    example: PostStatus.DRAFT,
    enum: PostStatus,
  })
  @IsEnum(PostStatus)
  @IsNotEmpty()
  status: PostStatus;

  // Post title
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Post',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(256)
  @IsNotEmpty()
  title: string;

  // Post slug
  @ApiProperty({
    description: 'The slug of the post',
    example: 'my-first-post',
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

  // Post content
  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first post',
    required: false,
  })
  @IsString()
  @IsOptional()
  content?: string;

  // Post schema
  @ApiProperty({
    description: 'The schema of the post, a serialized JSON object',
    example:
      '{\r\n  "@context": "https://schema.org",\r\n  "@type": "BlogPosting"\r\n}',
    required: false,
  })
  @IsJSON()
  @IsOptional()
  schema?: string;

  // Post featured image URL
  @ApiProperty({
    description: 'The featured image URL of the post',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsUrl()
  @MaxLength(1024)
  @IsOptional()
  featuredImageUrl?: string;

  // Post tags
  @ApiProperty({
    description: 'The tags of the post',
    example: [{ id: 1, name: 'Tag 1', slug: 'tag-1' }],
    required: false,
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  @IsOptional()
  tags?: CreateTagDto[];

  // Post metadata
  @ApiProperty({
    description: 'The metadata of the post',
    example: { metaValue: '{"key": "value"}' },
    required: false,
  })
  @IsOptional()
  metaOptions?: CreateMetaOptionDto;
}
