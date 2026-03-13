import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(data, salt);
  }

  async comparePassword(data: string | Buffer, hash: string): Promise<boolean> {
    return await bcrypt.compare(data, hash);
  }
}
