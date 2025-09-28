import { create } from 'zustand';
import { Task } from '../domain';
import taskService from '../api/services/taskService';
import { TaskCreateRequest, TaskUpdateRequest } from '../api/types/apiTypes';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: number) => Promise<void>;
  createTask: (taskData: TaskCreateRequest) => Promise<Task>;
  updateTask: (id: number, taskData: TaskUpdateRequest) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;
  clearTasks: () => void;
}

export const useTaskStore = create<TaskState & TaskActions>((set: (partial: Partial<TaskState & TaskActions>) => void, get: () => TaskState & TaskActions) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    try {
      set({ isLoading: true, error: null });
      const tasks = await taskService.getTasks();
      set({ tasks: tasks.data });
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить задачи', isLoading: false });
    }
  },

  fetchTaskById: async (id: number) => {
    try {
      const task = await taskService.getTask(id);
      const currentTasks = get().tasks;
      const exists = currentTasks.some((t: Task) => t.id === task.data.id);
      if (!exists) {
        set({ tasks: [...currentTasks, task.data] });
      }
    } catch (error: any) {
      set({ error: error.message || 'Не удалось получить задачу' });
    }
  },

  createTask: async (taskData: TaskCreateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newTask = await taskService.createTask(taskData);
      set({ tasks: [...get().tasks, newTask.data], isLoading: false });
      return newTask.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать задачу', isLoading: false });
      throw error;
    }
  },

  updateTask: async (id: number, taskData: TaskUpdateRequest) => {
    try {
      set({ isLoading: true, error: null });
      const updatedTask = await taskService.updateTask(id, taskData);
      set({ 
        tasks: get().tasks.map((t: Task) => t.id === id ? updatedTask.data : t),
        isLoading: false 
      });
      return updatedTask.data;
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить задачу', isLoading: false });
      throw error;
    }
  },

  deleteTask: async (id: number) => {
    try {
      set({ isLoading: true, error: null });
      await taskService.deleteTask(id);
      set({ 
        tasks: get().tasks.filter((t: Task) => t.id !== id),
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить задачу', isLoading: false });
      throw error;
    }
  },

  clearTasks: () => {
    set({ tasks: [], isLoading: false, error: null });
  },
}));
