import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { Task } from '../../models/tasks.models';
import { SnackBarService } from '../../services/snack-bar.service';
import { TaskManagerStore } from '../../store/task-manager.store';

const DEFAULT_ACTIONS = ['Activate', 'Delete'];

@Component({
  selector: 'tm-archived-tasks',
  templateUrl: './archived-tasks.component.html',
  styleUrl: './archived-tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TaskCardComponent],
})
export class ArchivedTasksComponent {
  private readonly store = inject(TaskManagerStore);
  private readonly snackBarService = inject(SnackBarService);

  readonly searchFormGroup = new FormGroup({
    title: new FormControl(''),
  });

  actions = signal<string[]>(DEFAULT_ACTIONS);

  isLoading = computed(this.computeIsLoading.bind(this));
  completedTasks = computed(this.computeCompletedTasks.bind(this));

  constructor() {
    this.store.fetchTasks();
    this.searchFormGroup.controls['title'].valueChanges.pipe(takeUntilDestroyed()).subscribe(title => this.store.searchTasks({ title: title ?? '' }));
  }

  public onAction(action: string, task: Task): void {
    switch (action) {
      case 'Activate':
        return this.activateTask(task);

      case 'Delete':
        return this.deleteTask(task);

      default:
        break;
    }
  }

  private computeIsLoading(store = this.store): boolean {
    return store.isLoading();
  }

  private computeCompletedTasks(store = this.store): Task[] {
    return store.completedTasks();
  }

  private activateTask(task: Task): void {
    this.store.updateTask({
      resource: { ...task, status: 'active' },
      afterSuccessFn: () => this.snackBarService.open('Task activated'),
    });
  }

  private deleteTask(task: Task): void {
    this.store.deleteTask({
      resource: task,
      afterSuccessFn: () => this.snackBarService.open('Task deleted'),
    });
  }
}
