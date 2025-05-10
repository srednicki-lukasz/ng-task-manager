import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { Task } from '../../models/tasks.models';
import { TaskManagerStore } from '../../store/task-manager.store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'tm-archived-tasks',
  templateUrl: './archived-tasks.component.html',
  styleUrl: './archived-tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, MatExpansionModule, MatButtonModule],
})
export class ArchivedTasksComponent implements OnInit {
  private readonly store = inject(TaskManagerStore);

  isLoading = computed(this.computeIsLoading.bind(this));
  completedTasks = computed(this.computeCompletedTasks.bind(this));

  public ngOnInit(): void {
    this.store.fetchTasks('completed');
  }

  private computeIsLoading(store = this.store): boolean {
    return store.isLoading();
  }

  private computeCompletedTasks(store = this.store): Task[] {
    return store.completedTasks();
  }

  public activateTask(task: Task): void {
    this.store.updateTask({ ...task, status: 'active' });
  }

  public deleteTask(id: string): void {
    this.store.deleteTask(id);
  }
}
