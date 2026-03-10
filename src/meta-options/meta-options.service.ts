import { Injectable } from '@nestjs/common';
import { CreateMetaOptionDto } from './dto/create-meta-option.dto';
import { UpdateMetaOptionDto } from './dto/update-meta-option.dto';

@Injectable()
export class MetaOptionsService {
  create(createMetaOptionDto: CreateMetaOptionDto) {
    console.log(createMetaOptionDto);
    return 'This action adds a new metaOption';
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
