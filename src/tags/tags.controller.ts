import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // Create a new tag
  @Post()
  // Swagger documentation
  @ApiOperation({
    summary: 'Create a new tag',
    description: 'Create a new tag',
  })
  @ApiResponse({
    status: 201,
    description: 'The tag has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  // Get all tags
  @Get()
  // Swagger documentation
  @ApiOperation({
    summary: 'Get all tags',
    description: 'Get all tags',
  })
  @ApiResponse({
    status: 200,
    description: 'The tags have been successfully retrieved.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  findAll() {
    return this.tagsService.findAll();
  }

  // Get a tag by id
  @Get(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Get a tag by id',
    description: 'Get a tag by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the tag',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.findOne(id);
  }

  // Update a tag by id
  @Patch(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Update a tag by id',
    description: 'Update a tag by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the tag',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto);
  }

  // Delete a tag by id
  @Delete(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Delete a tag by id',
    description: 'Delete a tag by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the tag',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }

  // Soft delete a tag by id
  @Delete(':id/soft-delete')
  // Swagger documentation
  @ApiOperation({
    summary: 'Soft delete a tag by id',
    description: 'Soft delete a tag by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the tag',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully soft deleted.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.softDelete(id);
  }

  // Restore a tag by id
  @Patch(':id/restore')
  // Swagger documentation
  @ApiOperation({
    summary: 'Restore a tag by id',
    description: 'Restore a tag by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the tag',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The tag has been successfully restored.',
  })
  @ApiResponse({ status: 404, description: 'Tag not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.restore(id);
  }
}
