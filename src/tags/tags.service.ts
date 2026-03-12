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
      throw new BadRequestException('Tag name already exists');
    }
    const existingSlug = await this.tagsRepository.findOne({
      where: { slug: createTagDto.slug },
    });
    if (existingSlug) {
      throw new BadRequestException('Tag slug already exists');
    }
    const tag = this.tagsRepository.create(createTagDto);
    return await this.tagsRepository.save(tag);
  }

  findAll() {
    return this.tagsRepository.find({ relations: ['posts'] });
  }

  async findOne(id: number) {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async findOneBySlug(slug: string) {
    const tag = await this.tagsRepository.findOne({ where: { slug } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return tag;
  }

  async findOneWithDeletedBySlug(slug: string) {
    const tag = await this.tagsRepository
      .createQueryBuilder('tag')
      .withDeleted() // include soft-deleted
      .where('tag.slug = :slug', { slug })
      .getOne();
    // if (!tag) {
    //   throw new NotFoundException('Tag not found');
    // }
    // Don't throw an error if the tag is not found. Because we may want to create a new tag if not found.
    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    Object.assign(tag, updateTagDto);
    return this.tagsRepository.save(tag);
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

  async softDelete(id: number) {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException('Tag not found');
    }
    return this.tagsRepository.softDelete(id);
  }

  async restore(id: number) {
    await this.tagsRepository.restore(id);
    return this.findOne(id);
  }
}
