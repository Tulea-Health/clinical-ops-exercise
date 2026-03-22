import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { tasksService, TaskStatus } from "../services";
import type { Task, CreateTaskData, TaskStatusValue } from "../types";

interface UseTasksOptions {
  autoFetch?: boolean;
  projectId?: number;
  status?: TaskStatusValue;
}

export function useTasks(options: UseTasksOptions = {}) {
  const { autoFetch = true, projectId, status } = options;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksService.getAll();
      setTasks(response.data || []);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (projectId !== undefined) {
      result = result.filter((task) => task.projectId === Number(projectId));
    }

    if (status) {
      result = result.filter((task) => task.status === status);
    }

    return result;
  }, [tasks, projectId, status]);

  const createTask = async (data: CreateTaskData) => {
    const response = await tasksService.create(data);
    await fetchTasks();
    toast.success("Task created successfully");
    return response.data;
  };

  const updateTask = async (id: number | string, data: Partial<CreateTaskData>) => {
    try {
      const response = await tasksService.update(id, data);
      setTasks((prev) =>
        prev.map((task) =>
          task.id === Number(id) ? { ...task, ...data } : task
        )
      );
      toast.success("Task updated successfully");
      return response.data;
    } catch (err) {
      await fetchTasks();
      throw err;
    }
  };

  const updateTaskStatus = async (id: number | string, newStatus: TaskStatusValue) => {
    return updateTask(id, { status: newStatus });
  };

  const deleteTask = async (id: number | string) => {
    try {
      await tasksService.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== Number(id)));
      toast.success("Task deleted successfully");
    } catch (err) {
      await fetchTasks();
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchTasks();
    }
  }, [autoFetch, fetchTasks]);

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    isLoading,
    error,
    refresh: fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    TaskStatus,
  };
}

export default useTasks;
