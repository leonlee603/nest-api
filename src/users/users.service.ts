import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HashingProvider } from 'src/auth/providers/hashing.provider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(forwardRef(() => HashingProvider))
    private hashingProvider: HashingProvider,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Check if the user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    // Hash the password
    const hashedPassword = await this.hashingProvider.hashPassword(
      createUserDto.password,
    );
    // Create a new user
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    // Save the user
    const savedUser = await this.userRepository.save(user);
    // Return the user without the password
    const { password, ...userWithoutPassword } = savedUser;
    console.log(password);
    return userWithoutPassword;
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneById(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateUserDto.password) {
      const hashedPassword = await this.hashingProvider.hashPassword(
        updateUserDto.password,
      );
      updateUserDto.password = hashedPassword;
    }
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(user);
  }
}
