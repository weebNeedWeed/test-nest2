import { User } from "./../auth/user.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TaskRepository } from "./task.repository";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./tasks.enum";
import { TaskFilterDto } from "./dto/task-filter.dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ id, userId: user.id });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User): Promise<void> {
    // const found = await this.taskRepository.delete({ id });

    // if (found.affected === 0) {
    //   throw new NotFoundException(`Task with ID "${id}" not found`);
    // }
    const found = await this.getTaskById(id, user);
    found.remove();
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const found = await this.getTaskById(id, user);

    found.status = status;
    found.save();

    return found;
  }

  getTasks(taskFilterDto: TaskFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(taskFilterDto, user);
  }
}
