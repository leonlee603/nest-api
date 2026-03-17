import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostQueryDto } from './dto/post-query.dto';
import { ActiveUser } from 'src/auth/decorator/active-user.decorator';
import type { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // Create a new post
  @Post()
  // Swagger documentation
  @ApiOperation({
    summary: 'Create a new post',
    description: 'Create a new post',
  })
  @ApiResponse({
    status: 201,
    description: 'The post has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  create(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: ActiveUserData,
  ) {
    return this.postsService.create(createPostDto, user);
  }

  // Get all posts
  @Get()
  // Swagger documentation
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Get all posts',
  })
  @ApiResponse({
    status: 200,
    description: 'The posts have been successfully retrieved.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  findAll(@Query() postQueryDto: PostQueryDto) {
    return this.postsService.findAll(postQueryDto);
  }

  // Get a post by id
  @Get(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Get a post by id',
    description: 'Get a post by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the post',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(id);
  }

  // Update a post by id
  @Patch(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Update a post by id',
    description: 'Update a post by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the post',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  // Delete a post by id
  @Delete(':id')
  // Swagger documentation
  @ApiParam({
    name: 'id',
    description: 'The id of the post',
    example: '1',
  })
  @ApiOperation({
    summary: 'Delete a post by id',
    description: 'Delete a post by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The post has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(id);
  }
}
