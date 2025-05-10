import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Task } from '../models/tasks.models';

@Injectable({ providedIn: 'root' })
export class TaskManagerHttpService {
  private readonly httpClient = inject(HttpClient);
  private readonly origin = '/api/tasks';

  public fetchTasks(status?: 'active' | 'completed'): Promise<Task[]> {
    return firstValueFrom(this.httpClient.get<Task[]>(this.origin, { params: status ? { status } : {} }));
  }

  public createTask(task: Task): Promise<Task> {
    return firstValueFrom(this.httpClient.post<Task>(`${this.origin}`, task));
  }

  public updateTask(task: Task): Promise<Task> {
    return firstValueFrom(this.httpClient.put<Task>(`${this.origin}/${task._id}`, task));
  }

  public deleteTask(id: string): Promise<Task> {
    return firstValueFrom(this.httpClient.delete<Task>(`${this.origin}/${id}`));
  }
}
