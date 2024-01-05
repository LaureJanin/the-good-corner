import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { IsEmail, Matches } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Ad } from "./Ad";

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id!: number;

  @Column({ length: 255, unique: true })
  @Field()
  @IsEmail()
  email!: string;

  @Column({ length: 255 })
  hashedPassword!: string;

  @Column({ default: "user" })
  @Field()
  role!: string;

  @OneToMany(() => Ad, (ad) => ad.createdBy)
  @Field(() => [Ad])
  ads!: Ad[];
}

@InputType()
export class UserCreateInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Matches(/^.{8,50}/)
  password!: string;
}

@InputType()
export class AdminCreateUserWithRoleInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Matches(/^.{8,50}/)
  password!: string;

  @Field()
  role!: string;
}

// @InputType()
// export class UserUpdateInput {
//   @Field({ nullable: true })
//   name!: string;
// }
