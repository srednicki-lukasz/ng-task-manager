import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Task } from '../models/tasks.models';
import { TaskManagerHttpService } from './task-manager-http.service';

type TaskManagerState = {
  isLoading: boolean;
  tasks: Task[];
};

const initialState: TaskManagerState = {
  isLoading: false,
  tasks: [],
};

export const TaskManagerStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ tasks }) => ({
    activeTasks: computed(() => tasks().filter(({ status }) => status === 'active')),
    completedTasks: computed(() => tasks().filter(({ status }) => status === 'completed')),
  })),
  withMethods((store, router = inject(Router), taskManagerHttpService = inject(TaskManagerHttpService)) => ({
    async fetchTasks(status?: 'active' | 'completed') {
      patchState(store, { isLoading: true });

      const tasks = await taskManagerHttpService.fetchTasks(status);
      patchState(store, { isLoading: false, tasks });
    },

    async createTask(task: Task) {
      patchState(store, { isLoading: true });

      const newTask = await taskManagerHttpService.createTask(task);
      patchState(store, { isLoading: false, tasks: [...store.tasks(), newTask] });

      void router.navigateByUrl('/');
    },

    async updateTask(task: Task) {
      patchState(store, { isLoading: true });

      const updatedTask = await taskManagerHttpService.updateTask(task);
      const mappedTasks = store.tasks().map(task => (task._id === updatedTask._id ? updatedTask : task));
      patchState(store, { isLoading: false, tasks: mappedTasks });
    },

    async deleteTask(id: string) {
      patchState(store, { isLoading: true });

      const deletedTask = await taskManagerHttpService.deleteTask(id);
      const filteredTasks = store.tasks().filter(task => task._id !== deletedTask._id);
      patchState(store, { isLoading: false, tasks: filteredTasks });
    },
  }))
);
