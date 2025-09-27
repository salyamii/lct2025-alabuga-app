import { create } from 'zustand';
import { Task } from '../domain';
import taskService from '../api/services/taskService';

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

interface TaskActions {
  fetchTasks: () => Promise<void>;
  fetchTaskById: (id: number) => Promise<void>;
  createTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
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

  createTask: async (task: Task) => {
    try {
      const taskData = {
        title: task.title,
        description: task.description
      };
      const newTask = await taskService.createTask(taskData);
      set({ tasks: [...get().tasks, newTask.data] });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось создать задачу' });
    }
  },

  updateTask: async (task: Task) => {
    try {
      const taskData = {
        title: task.title,
        description: task.description
      };
      const updatedTask = await taskService.updateTask(task.id, taskData);
      set({ tasks: get().tasks.map((t: Task) => t.id === task.id ? updatedTask.data : t) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось обновить задачу' });
    }
  },

  deleteTask: async (id: number) => {
    try {
      await taskService.deleteTask(id);
      set({ tasks: get().tasks.filter((t: Task) => t.id !== id) });
    } catch (error: any) {
      set({ error: error.message || 'Не удалось удалить задачу' });
    }
  },

  clearTasks: () => {
    set({ tasks: [], isLoading: false, error: null });
  },
}));
