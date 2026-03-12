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
import { MetaOptionsService } from './meta-options.service';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  // Create a new meta option
  @Post()
  // Swagger documentation
  @ApiOperation({
    summary: 'Create a new meta option',
    description: 'Create a new meta option',
  })
  @ApiResponse({
    status: 201,
    description: 'The meta option has been successfully created.',
  })
  // Controller method
  create(@Body() createMetaOptionDto: CreateMetaOptionDto) {
    return this.metaOptionsService.create(createMetaOptionDto);
  }

  // Get all meta options
  @Get()
  // Swagger documentation
  @ApiOperation({
    summary: 'Get all meta options',
    description: 'Get all meta options',
  })
  @ApiResponse({
    status: 200,
    description: 'The meta options have been successfully retrieved.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  findAll() {
    return this.metaOptionsService.findAll();
  }

  // Get a meta option by id
  @Get(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Get a meta option by id',
    description: 'Get a meta option by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the meta option',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The meta option has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'Meta option not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.metaOptionsService.findOne(+id);
  }

  // Update a meta option by id
  @Patch(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Update a meta option by id',
    description: 'Update a meta option by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the meta option',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The meta option has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 404, description: 'Meta option not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMetaOptionDto: UpdateMetaOptionDto,
  ) {
    return this.metaOptionsService.update(id, updateMetaOptionDto);
  }

  // Delete a meta option by id
  @Delete(':id')
  // Swagger documentation
  @ApiOperation({
    summary: 'Delete a meta option by id',
    description: 'Delete a meta option by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the meta option',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The meta option has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Meta option not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  // Controller method
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.metaOptionsService.remove(id);
  }
}
