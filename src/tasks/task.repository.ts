import { User } from "./../auth/user.entity";
import { EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./tasks.enum";
import { TaskFilterDto } from "./dto/task-filter.dto";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;

    const newTask = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await newTask.save();

    delete newTask.user;

    return newTask;
  }

  async getTasks(taskFilterDto: TaskFilterDto, user: User): Promise<Task[]> {
    const { search, status } = taskFilterDto;
    const queryBuilder = this.createQueryBuilder("task");

    queryBuilder.where("task.userId = :userId", { userId: user.id });

    if (search) {
      queryBuilder.andWhere(
        "task.title LIKE :search OR task.description LIKE :search",
        { search: `%${search}%` },
      );
    }

    if (status) {
      queryBuilder.andWhere("task.status = :status", { status });
    }

    const tasks = await queryBuilder.getMany();

    return tasks;
  }
}
