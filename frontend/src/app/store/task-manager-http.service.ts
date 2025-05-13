import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { Task, TaskQueryParams } from '../models/tasks.models';

@Injectable({ providedIn: 'root' })
export class TaskManagerHttpService {
  private readonly httpClient = inject(HttpClient);
  private readonly origin = '/api/tasks';

  public fetchTasks(): Promise<Task[]> {
    return firstValueFrom(this.httpClient.get<Task[]>(this.origin));
  }

  public searchTasks(params: TaskQueryParams = {}): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.origin, { params });
  }

  public createTask(task: Task): Promise<Task> {
    return firstValueFrom(this.httpClient.post<Task>(`${this.origin}`, task));
  }

  public updateTask(task: Task): Promise<Task> {
    return firstValueFrom(this.httpClient.put<Task>(`${this.origin}/${task._id}`, task));
  }

  public deleteTask(task: Task): Promise<Task> {
    return firstValueFrom(this.httpClient.delete<Task>(`${this.origin}/${task._id}`));
  }
}
