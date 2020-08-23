import { NotFoundException } from "@nestjs/common";
import { TaskFilterDto } from "./dto/task-filter.dto";
import { Test } from "@nestjs/testing";
import { TaskRepository } from "./task.repository";
import { TasksService } from "./tasks.service";
import { TaskStatus } from "./tasks.enum";

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

describe("TasksService", () => {
  let tasksService;
  let taskRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = moduleRef.get<TasksService>(TasksService);
    taskRepository = moduleRef.get<TaskRepository>(TaskRepository);
  });
  const mockUser = {
    username: "username",
    id: 1,
  };
  const mockTask = {
    title: "fakeTitle",
    description: "fakeDescription",
    status: TaskStatus.OPEN,
    remove: jest.fn(),
    save: jest.fn(),
  };

  describe("getTasks", () => {
    it("should get all tasks", async () => {
      taskRepository.getTasks.mockResolvedValue("someTask");
      //  check xem taskRepository.getTasks da duoc goi bao gio chua
      expect(taskRepository.getTasks).not.toHaveBeenCalled();

      const filter: TaskFilterDto = {
        search: "some text",
        status: TaskStatus.OPEN,
      };
      const result = await tasksService.getTasks(filter, mockUser);

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toBe("someTask");
    });
  });

  describe("getTaskById", () => {
    it("should return task query by task id and user id", async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(taskRepository.findOne).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
      expect(result).toBe(mockTask);
    });

    it("should throw NotFoundException exception when not found", async () => {
      taskRepository.findOne.mockResolvedValue(null);

      const result = tasksService.getTaskById(1, mockUser);

      expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe("createTask", () => {
    it("should return a new task when call", async () => {
      const mockTask = { title: "fakeTitle", description: "fakeDescription" };

      taskRepository.createTask.mockResolvedValue(mockTask);
      const result = await tasksService.createTask(mockTask, mockUser);

      expect(result).toEqual(mockTask);
    });
  });

  describe("deleteTask", () => {
    it("should return a task when found", async () => {
      tasksService.getTaskById = jest.fn();
      tasksService.getTaskById.mockResolvedValue(mockTask);

      mockTask.remove.mockReturnValue(true);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      await tasksService.deleteTask(1, mockUser);

      expect(mockTask.remove).toHaveBeenCalled();
      expect(mockTask.remove).toReturnWith(true);
    });
  });

  describe("updateTaskStatus", () => {
    it("should return a task when found", async () => {
      tasksService.getTaskById = jest.fn();
      tasksService.getTaskById.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      const updated = await tasksService.updateTaskStatus(
        1,
        TaskStatus.COMPLETE,
        mockUser,
      );

      expect(updated).toEqual({ ...mockTask, status: TaskStatus.COMPLETE });
    });
  });
});
