import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GoogleUser } from '../interfaces/google-user.interface';

@Injectable()
export class CreateGoogleUserProvider {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createGoogleUser(googleUser: GoogleUser) {
    const existingUser = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const user = this.userRepository.create(googleUser);
    return await this.userRepository.save(user);
  }
}
