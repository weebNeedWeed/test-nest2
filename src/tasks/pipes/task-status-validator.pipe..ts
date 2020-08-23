import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../tasks.enum";

export class TaskStatusValidator implements PipeTransform {
  readonly validStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.COMPLETE,
  ];

  transform(value: string): string {
    value = value.toUpperCase();

    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`"${value}" is not valid status`);
    }

    return value;
  }

  isValidStatus(status: string): boolean {
    const found: number = this.validStatus.findIndex((elm) => elm === status);

    return found !== -1;
  }
}
