import { computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { Task, TaskQueryParams } from '../models/tasks.models';
import { TaskManagerHttpService } from './task-manager-http.service';

type TaskManagerState = {
  isLoading: boolean;
  tasks: Task[];
};

const initialState: TaskManagerState = {
  isLoading: true,
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
    async fetchTasks() {
      if (store.tasks().length) return;
      patchState(store, { isLoading: true });

      const tasks = await taskManagerHttpService.fetchTasks();

      patchState(store, { isLoading: false, tasks });
    },

    searchTasks: rxMethod<TaskQueryParams>(
      pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => patchState(store, { isLoading: true })),
        switchMap(params =>
          taskManagerHttpService.searchTasks(params).pipe(
            tapResponse({
              next: (tasks: Task[]) => patchState(store, { tasks, isLoading: false }),
              error: err => {
                patchState(store, { isLoading: false });
                console.error(err);
              },
            })
          )
        )
      )
    ),

    async createTask({ resource, afterSuccessFn }: { resource: Task; afterSuccessFn?: () => void }) {
      patchState(store, { isLoading: true });

      const created = await taskManagerHttpService.createTask(resource);

      patchState(store, {
        isLoading: false,
        tasks: [...store.tasks(), created],
      });

      void router.navigateByUrl('/');
      afterSuccessFn?.();
    },

    async updateTask({ resource, afterSuccessFn }: { resource: Task; afterSuccessFn?: () => void }) {
      patchState(store, { isLoading: true });

      const updated = await taskManagerHttpService.updateTask(resource);

      patchState(store, {
        isLoading: false,
        tasks: store.tasks().map(task => (task._id === updated._id ? updated : task)),
      });
      afterSuccessFn?.();
    },

    async deleteTask({ resource, afterSuccessFn }: { resource: Task; afterSuccessFn?: () => void }) {
      patchState(store, { isLoading: true });

      const deleted = await taskManagerHttpService.deleteTask(resource);

      patchState(store, {
        isLoading: false,
        tasks: store.tasks().filter(task => task._id !== deleted._id),
      });
      afterSuccessFn?.();
    },
  }))
);
