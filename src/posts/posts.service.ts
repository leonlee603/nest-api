import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UsersService } from '../users/users.service';
// import { MetaOption } from '../meta-options/entities/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    // @InjectRepository(MetaOption)
    // private metaOptionsRepository: Repository<MetaOption>,
    private usersService: UsersService,
  ) {}
  async create(createPostDto: CreatePostDto) {
    // TODO: get the user from the guard and set it to the post
    // create a demo user for testing
    const demoUser = await this.usersService.findOneByEmail(
      'john.doe@example.com',
    );
    if (!demoUser) {
      throw new UnauthorizedException('Please login to create a post');
    }

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
    post.author = demoUser;
    return await this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find({ relations: ['metaOptions', 'author'] });
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
