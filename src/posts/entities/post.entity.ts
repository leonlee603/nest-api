import {
  Entity,
  PrimaryGeneratedColumn,
  // Column,
  // CreateDateColumn,
  // UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column()
  // postType: string;

  // @Column()
  // status: string;

  // @Column({ nullable: false })
  // title: string;

  // @Column({ nullable: false })
  // slug: string;

  // @Column({ nullable: true })
  // content?: string;

  // @Column()
  // schema?: string;

  // @Column()
  // featuredImageUrl?: string;

  // @Column('text', { array: true, default: [] })
  // tags?: string[];

  // @Column()
  // metaOptions?: [{ key: string; value: string }];

  // @CreateDateColumn()
  // createdAt: Date;

  // @UpdateDateColumn()
  // updatedAt: Date;
}
