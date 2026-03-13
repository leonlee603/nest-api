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
import { TagsService } from '../tags/tags.service';
import { MetaOption } from '../meta-options/entities/meta-option.entity';
import { PostQueryDto } from './dto/post-query.dto';
import { buildPaginationResult } from 'src/common/pagination/pagination.helper';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    // @InjectRepository(MetaOption)
    // private metaOptionsRepository: Repository<MetaOption>,
    private usersService: UsersService,
    private tagsService: TagsService,
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

    const tags =
      createPostDto.tags && createPostDto.tags.length > 0
        ? await Promise.all(
            createPostDto.tags.map((name) => this.preloadTagsByName(name)),
          )
        : [];

    const post = this.postsRepository.create({
      ...createPostDto,
      tags,
    });
    post.author = demoUser;
    return await this.postsRepository.save(post);
  }

  async findAll(postQueryDto: PostQueryDto) {
    const { page, limit, ...query } = postQueryDto;
    const skip = (page! - 1) * limit!;

    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.metaOptions', 'metaOptions')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.tags', 'tags')
      .orderBy('post.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (query.postType) {
      qb.andWhere('post.postType = :postType', { postType: query.postType });
    }

    if (query.status) {
      qb.andWhere('post.status = :status', { status: query.status });
    }

    if (query.authorId) {
      qb.andWhere('post.authorId = :authorId', { authorId: query.authorId });
    }

    if (query.search) {
      qb.andWhere('(post.title ILIKE :search OR post.content ILIKE :search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.tagSlugs && query.tagSlugs.length > 0) {
      qb.andWhere('tags.slug IN (:...tagSlugs)', { tagSlugs: query.tagSlugs });
      // OR semantics: post has at least one of these tags
    }

    if (query.from) {
      qb.andWhere('post.createdAt >= :from', { from: query.from });
    }

    if (query.to) {
      qb.andWhere('post.createdAt <= :to', { to: query.to });
    }

    const [posts, total] = await qb.getManyAndCount();

    // return {
    //   data: posts,
    //   meta: {
    //     totalPosts: total,
    //     postCount: posts.length,
    //     postsPerPage: limit!,
    //     totalPages: Math.ceil(total / limit!),
    //     currentPage: page,
    //   },
    // };
    return buildPaginationResult<Post>(posts, total, postQueryDto);
  }

  async findOne(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['metaOptions', 'author', 'tags'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['metaOptions', 'tags', 'author'],
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    if (updatePostDto.slug && updatePostDto.slug !== post.slug) {
      const existingSlug = await this.postsRepository.findOne({
        where: { slug: updatePostDto.slug },
      });
      if (existingSlug) {
        throw new BadRequestException('Slug already exists');
      }
    }

    // 1. Handle tags if provided
    let tags = post.tags;
    if (updatePostDto.tags) {
      tags =
        updatePostDto.tags.length > 0
          ? await Promise.all(
              updatePostDto.tags.map((name) => this.preloadTagsByName(name)),
            )
          : [];
    }

    // 2. Handle metaOptions if provided
    if (updatePostDto.metaOptions) {
      if (post.metaOptions) {
        // update existing metaOption instead of creating a new one
        post.metaOptions.metaValue =
          updatePostDto.metaOptions.metaValue ?? post.metaOptions.metaValue;
      } else {
        // create new metaOption if none existed
        const meta = new MetaOption();
        meta.metaValue = updatePostDto.metaOptions.metaValue;
        post.metaOptions = meta;
      }
    }

    // 3. Merge scalar fields (but NOT metaOptions, already handled)
    const {
      metaOptions: _metaOptionsFromDto,
      tags: _tagsFromDto,
      ...rest
    } = updatePostDto; // extract the rest because we have already handled metaOptions and tags separately
    console.log(_metaOptionsFromDto);
    console.log(_tagsFromDto);

    // because metaOptions is a one-to-one relationship, we need to handle it separately
    Object.assign(post, {
      ...rest,
      tags,
    });

    return this.postsRepository.save(post);
  }

  async remove(id: number) {
    // return await this.postsRepository.delete(id);
    // Instead of using delete, we will use findOne and then remove() to delete the post.
    // Because only remove() will trigger the hooks in the entity.
    const post = await this.findOne(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return this.postsRepository.remove(post);
  }

  async preloadTagsByName(name: string) {
    const slug = name.toLowerCase().trim().replace(/ /g, '-');
    // 1. Find tag including soft-deleted ones
    const existingTag = await this.tagsService.findOneWithDeletedBySlug(slug);

    // 2. If exists and is soft-deleted -> restore and reuse
    if (existingTag && existingTag.deletedAt) {
      return await this.tagsService.restore(existingTag.id);
    }

    // 3. If exists and not deleted -> just reuse
    if (existingTag) {
      return existingTag;
    }

    // 4. Else create new
    return this.tagsService.create({ name, slug });
  }
}
