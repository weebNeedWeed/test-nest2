import { User } from "./../auth/user.entity";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { TaskStatus } from "./tasks.enum";

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne(
    () => User,
    (user) => user.tasks,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
