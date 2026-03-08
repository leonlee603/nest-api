import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create a new user
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Create a new user',
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // Get all users
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Get all users',
  })
  @ApiResponse({
    status: 200,
    description: 'The users have been successfully retrieved.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findAll() {
    return this.usersService.findAll();
  }

  // Get a user by id
  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by id',
    description: 'Get a user by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  // Update a user by id
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a user by id',
    description: 'Update a user by id',
  })
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 400, description: 'Invalid request body.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  // Delete a user by id
  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The id of the user',
    example: '1',
  })
  @ApiOperation({
    summary: 'Delete a user by id',
    description: 'Delete a user by id',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
