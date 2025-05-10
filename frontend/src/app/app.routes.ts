import { Routes } from '@angular/router';
import { ActiveTasksComponent } from './containers/active-tasks/active-tasks.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ActiveTasksComponent,
  },
  {
    path: 'archived-tasks',
    loadComponent: () =>
      import('./containers/archived-tasks/archived-tasks.component').then(m => m.ArchivedTasksComponent),
  },
  {
    path: 'create-new-task',
    loadComponent: () =>
      import('./containers/create-new-task/create-new-task.component').then(m => m.CreateNewTaskComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
