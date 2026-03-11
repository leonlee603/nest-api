import { Post } from '../../posts/entities/post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 256, unique: true, nullable: false })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  schema?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  featuredImageUrl?: string;

  @ManyToMany(() => Post, (post) => post.tags, { onDelete: 'CASCADE' })
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
