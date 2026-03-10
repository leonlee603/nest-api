import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
// import { MetaOption } from '../meta-options/entities/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    // @InjectRepository(MetaOption)
    // private metaOptionsRepository: Repository<MetaOption>,
  ) {}
  async create(createPostDto: CreatePostDto) {
    const existingSlug = await this.postsRepository.findOne({
      where: { slug: createPostDto.slug },
    });
    if (existingSlug) {
      throw new BadRequestException('Slug already exists');
    }

    // const { metaOptions, ...postData } = createPostDto;
    // const post = this.postsRepository.create(postData);
    // if (metaOptions) {
    //   const metaOption = this.metaOptionsRepository.create(metaOptions);
    //   post.metaOptions = metaOption;
    // }
    // return await this.postsRepository.save(post);
    const post = this.postsRepository.create(createPostDto);
    return await this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find({ relations: ['metaOptions'] });
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({ where: { id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    console.log(updatePostDto);
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    const post = await this.findOne(id);
    return this.postsRepository.remove(post);
  }
}
