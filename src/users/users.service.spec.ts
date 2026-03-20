import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateGoogleUserProvider } from './providers/create-google-user.provider';
import { FindOneByGoogleIdProvider } from './providers/find-one-by-google-id.provider';
import { HashingProvider } from '../auth/providers/hashing.provider';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GoogleUser } from './interfaces/google-user.interface';

const createRepositoryMock = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
});

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;
  let hashingProvider: { hashPassword: jest.Mock; comparePassword: jest.Mock };
  let createGoogleUserProvider: { createGoogleUser: jest.Mock };
  let findOneByGoogleIdProvider: { findOneByGoogleId: jest.Mock };

  beforeEach(async () => {
    hashingProvider = {
      hashPassword: jest.fn(),
      comparePassword: jest.fn(),
    };

    createGoogleUserProvider = {
      createGoogleUser: jest.fn(),
    };

    findOneByGoogleIdProvider = {
      findOneByGoogleId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: createRepositoryMock(),
        },
        {
          provide: HashingProvider,
          useValue: hashingProvider,
        },
        {
          provide: CreateGoogleUserProvider,
          useValue: createGoogleUserProvider,
        },
        {
          provide: FindOneByGoogleIdProvider,
          useValue: findOneByGoogleIdProvider,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should throw if user already exists', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ id: '1' });

      await expect(
        service.create({
          email: 'test@example.com',
          password: '12345678',
          name: 'Test',
        } as CreateUserDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should hash password and save new user', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);
      hashingProvider.hashPassword.mockResolvedValue('hashed-pass');
      (repo.create as jest.Mock).mockImplementation((data: User) => data);
      (repo.save as jest.Mock).mockImplementation((user) =>
        Promise.resolve({ id: '1', ...user }),
      );

      const result = await service.create({
        email: 'test@example.com',
        password: '12345678',
        name: 'Test',
      } as CreateUserDto);

      expect(hashingProvider.hashPassword).toHaveBeenCalledWith('12345678');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        password: 'hashed-pass',
        name: 'Test',
      });
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      (repo.find as jest.Mock).mockResolvedValue([{ id: '1' }]);

      const result = await service.findAll();

      expect(result).toEqual([{ id: '1' }]);
    });
  });

  describe('findOne', () => {
    it('should throw if user not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should return user if found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await service.findOne('1');
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('findOneByEmail', () => {
    it('should throw if user not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.findOneByEmail('test@example.com'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should return user if found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue({ id: '1' });

      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual({ id: '1' });
    });
  });

  describe('update', () => {
    it('should throw if user not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.update('1', { name: 'Updated' } as UpdateUserDto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should hash password if provided and save', async () => {
      const user = { id: '1', name: 'Old', password: 'old' };
      (repo.findOne as jest.Mock).mockResolvedValue(user);
      hashingProvider.hashPassword.mockResolvedValue('new-hashed');
      (repo.save as jest.Mock).mockImplementation((u) => Promise.resolve(u));

      const result = await service.update('1', {
        password: '12345678',
        name: 'New',
      } as UpdateUserDto);

      expect(hashingProvider.hashPassword).toHaveBeenCalledWith('12345678');

      expect(result).toEqual({
        id: '1',
        name: 'New',
        password: 'new-hashed',
      });
    });
  });

  describe('updateRefreshToken', () => {
    it('should throw if user not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateRefreshToken('1', 'hash'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should update refreshTokenHash', async () => {
      const user = { id: '1', refreshTokenHash: null };
      (repo.findOne as jest.Mock).mockResolvedValue(user);
      (repo.save as jest.Mock).mockImplementation((u) => Promise.resolve(u));

      const result = await service.updateRefreshToken('1', 'hash');

      expect(result.refreshTokenHash).toBe('hash');
    });
  });

  describe('remove', () => {
    it('should throw if user not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should remove user', async () => {
      const user = { id: '1' };
      (repo.findOne as jest.Mock).mockResolvedValue(user);
      (repo.remove as jest.Mock).mockResolvedValue(user);

      const result = await service.remove('1');

      expect(result).toEqual(user);
    });
  });

  describe('google helpers', () => {
    it('findOneByGoogleId should delegate to provider', async () => {
      findOneByGoogleIdProvider.findOneByGoogleId.mockResolvedValue({
        id: '1',
      });

      const result = await service.findOneByGoogleId('google-id');
      expect(findOneByGoogleIdProvider.findOneByGoogleId).toHaveBeenCalledWith(
        'google-id',
      );
      expect(result).toEqual({ id: '1' });
    });

    it('createGoogleUser should delegate to provider', async () => {
      createGoogleUserProvider.createGoogleUser.mockResolvedValue({
        id: '1',
      });

      const result = await service.createGoogleUser({
        googleId: 'g',
        email: 'e',
        name: 'n',
      } as GoogleUser);

      expect(createGoogleUserProvider.createGoogleUser).toHaveBeenCalled();
      expect(result).toEqual({ id: '1' });
    });
  });
});
