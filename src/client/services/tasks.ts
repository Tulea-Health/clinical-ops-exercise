import api from "./api";
import type { Task, CreateTaskData } from "../types";
import { TaskStatus, Priority } from "../types";

export { TaskStatus, Priority };

export const tasksService = {
  getAll: () => api.get<Task[]>("/task/list"),
  getById: (id: number | string) => api.get<Task>(`/task/${id}`),
  create: (data: CreateTaskData) => api.post<Task>("/task", data),
  update: (id: number | string, data: Partial<CreateTaskData>) =>
    api.put<Task>(`/task/${id}`, data),
  delete: (id: number | string) => api.delete<Task>(`/task/${id}`),
};

export default tasksService;
