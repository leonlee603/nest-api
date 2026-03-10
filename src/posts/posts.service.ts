import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MetaOption } from '../meta-options/entities/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private metaOptionsRepository: Repository<MetaOption>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const existingSlug = await this.postsRepository.findOne({
      where: { slug: createPostDto.slug },
    });
    if (existingSlug) {
      throw new BadRequestException('Slug already exists');
    }

    const { metaOptions, ...postData } = createPostDto;
    const post = this.postsRepository.create(postData);
    if (metaOptions) {
      const metaOption = this.metaOptionsRepository.create(metaOptions);
      post.metaOptions = metaOption;
    }
    return await this.postsRepository.save(post);
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    console.log(updatePostDto);
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
