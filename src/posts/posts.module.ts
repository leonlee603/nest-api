import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { MetaOption } from '../meta-options/entities/meta-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, MetaOption])],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
