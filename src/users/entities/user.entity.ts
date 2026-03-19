import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 256, nullable: true })
  name?: string;

  @Column({ type: 'varchar', length: 256, unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 256, nullable: true })
  password?: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  googleId?: string;

  @OneToMany(() => Post, (post) => post.author, { cascade: true })
  posts: Post[];

  @Exclude()
  @Column({ type: 'varchar', length: 256, nullable: true })
  refreshTokenHash?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
