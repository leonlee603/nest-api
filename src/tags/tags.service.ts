import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto) {
    const existingName = await this.tagsRepository.findOne({
      where: { name: createTagDto.name },
    });
    if (existingName) {
      throw new BadRequestException('Name already exists');
    }
    const existingTag = await this.tagsRepository.findOne({
      where: { slug: createTagDto.slug },
    });
    if (existingTag) {
      throw new BadRequestException('Tag already exists');
    }
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  findAll() {
    return this.tagsRepository.find({ relations: ['posts'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  findOneBySlug(slug: string) {
    return this.tagsRepository.findOne({ where: { slug } });
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    console.log(updateTagDto);
    return `This action updates a #${id} tag`;
  }

  async remove(id: number) {
    // return await this.tagsRepository.delete(id);
    // Instead of using delete, we will use findOne and then remove() to delete the tag.
    // Because only remove() will trigger the hooks in the entity.
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return this.tagsRepository.remove(tag);
  }
}
