import { AuthGuard } from "@nestjs/passport";
import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Body,
  ValidationPipe,
  Delete,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Task } from "./task.entity";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskStatus } from "./tasks.enum";
import { TaskStatusValidator } from "./pipes/task-status-validator.pipe.";
import { TaskFilterDto } from "./dto/task-filter.dto";
import { getUser } from "src/auth/get-user.decorator";
import { User } from "src/auth/user.entity";

@Controller("tasks")
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  // @UsePipes(ValidationPipe)
  createTask(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @getUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get()
  getTasks(
    @Query(ValidationPipe) taskFilterDto: TaskFilterDto,
    @getUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(taskFilterDto, user);
  }

  @Get("/:id")
  getTaskById(
    @Param("id", ParseIntPipe) id: number,
    @getUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete("/:id")
  deleteTask(
    @Param("id", ParseIntPipe) id: number,
    @getUser() user: User,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch("/:id/status")
  updateTaskStatus(
    @Param("id", ParseIntPipe) id: number,
    @Body("status", TaskStatusValidator) status: TaskStatus,
    @getUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
