import { Injectable } from '@nestjs/common';
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
    return `This action returns all metaOptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} metaOption`;
  }

  update(id: number, updateMetaOptionDto: UpdateMetaOptionDto) {
    console.log(updateMetaOptionDto);
    return `This action updates a #${id} metaOption`;
  }

  remove(id: number) {
    return `This action removes a #${id} metaOption`;
  }
}
