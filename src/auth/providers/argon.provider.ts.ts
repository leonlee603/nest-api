import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider';
import * as argon2 from 'argon2';

@Injectable()
export class ArgonProviderTs implements HashingProvider {
  async hashPassword(data: string | Buffer): Promise<string> {
    return await argon2.hash(data, {
      memoryCost: 19456,
      timeCost: 2,
      parallelism: 1,
    });
  }

  async comparePassword(data: string | Buffer, hash: string): Promise<boolean> {
    const passwordMatch = await argon2.verify(hash, data);
    return passwordMatch;
  }
}
