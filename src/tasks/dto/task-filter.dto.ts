import { TaskStatus } from "../tasks.enum";
import { IsOptional, IsIn } from "class-validator";

export class TaskFilterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.COMPLETE, TaskStatus.IN_PROGRESS])
  status: TaskStatus;

  @IsOptional()
  search: string;
}
