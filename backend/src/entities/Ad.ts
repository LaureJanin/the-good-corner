import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from "typeorm";

import { Length, Min, Max } from "class-validator";

import { Category } from "./Category";
import { Tag } from "./Tag";

@Entity()
export class Ad extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  @Length(2, 100, {
    message: "Entre 2 et 100 caractères",
  })
  title!: string;

  @Column()
  @Length(0, 5000)
  description!: string;

  @Column({ length: 100 })
  owner!: string;

  @Column()
  @Min(1)
  @Max(100000000)
  price!: number;

  @Column({ length: 100 })
  imgUrl!: string;

  @Column({ length: 100 })
  location!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Category, (category) => category.ads)
  category!: Category;

  @ManyToMany(() => Tag, (tag) => tag.ads)
  @JoinTable()
  tags!: Tag[];
}
