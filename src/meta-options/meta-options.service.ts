import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';
import { Repository } from 'typeorm';
import { MetaOption } from './entities/meta-option.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}

  async create(createMetaOptionDto: CreateMetaOptionDto) {
    const metaOption = this.metaOptionsRepository.create(createMetaOptionDto);
    return await this.metaOptionsRepository.save(metaOption);
  }

  findAll() {
    return this.metaOptionsRepository.find();
  }

  async findOne(id: number) {
    const metaOption = await this.metaOptionsRepository.findOne({
      where: { id },
    });
    if (!metaOption) {
      throw new NotFoundException('Meta option not found');
    }
    return metaOption;
  }

  async update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    const metaOption = await this.metaOptionsRepository.findOne({
      where: { id },
    });
    if (!metaOption) {
      throw new NotFoundException('Meta option not found');
    }
    Object.assign(metaOption, updateMetaOptionDto);
    return this.metaOptionsRepository.save(metaOption);
  }

  async remove(id: number) {
    const metaOption = await this.metaOptionsRepository.findOne({
      where: { id },
    });
    if (!metaOption) {
      throw new NotFoundException('Meta option not found');
    }
    return this.metaOptionsRepository.remove(metaOption);
  }
}
