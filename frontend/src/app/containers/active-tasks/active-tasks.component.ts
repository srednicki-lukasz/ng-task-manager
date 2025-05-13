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

const DEFAULT_ACTIONS = ['Edit', 'Complete', 'Delete'];
const DURING_EDIT_ACTIONS = ['Cancel', 'Save'];

@Component({
  selector: 'tm-active-tasks',
  templateUrl: './active-tasks.component.html',
  styleUrl: './active-tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, TaskCardComponent],
})
export class ActiveTasksComponent {
  private readonly store = inject(TaskManagerStore);
  private readonly snackBarService = inject(SnackBarService);

  readonly searchFormGroup = new FormGroup({ title: new FormControl('') });
  readonly editFormGroup = new FormGroup({ description: new FormControl('') });

  actions = signal<string[]>(DEFAULT_ACTIONS);
  editingTaskId = signal<string | null>(null);

  isLoading = computed(this.computeIsLoading.bind(this));
  activeTasks = computed(this.computeActiveTasks.bind(this));

  constructor() {
    this.store.fetchTasks();
    this.searchFormGroup.controls['title'].valueChanges.pipe(takeUntilDestroyed()).subscribe(title => this.store.searchTasks({ title: title ?? '' }));
  }

  public onAction(action: string, task: Task): void {
    switch (action) {
      case 'Edit':
        return this.editTask(task);

      case 'Complete':
        return this.completeTask(task);

      case 'Delete':
        return this.deleteTask(task);

      case 'Save':
        return this.save(task);

      case 'Cancel':
        return this.cancel();

      default:
        break;
    }
  }

  private computeIsLoading(store = this.store): boolean {
    return store.isLoading();
  }

  private computeActiveTasks(store = this.store): Task[] {
    return store.activeTasks();
  }

  private editTask(task: Task): void {
    this.editingTaskId.set(task._id!);
    this.actions.set(DURING_EDIT_ACTIONS);
    this.editFormGroup.setValue({ description: task.description });
  }

  private completeTask(task: Task): void {
    this.store.updateTask({
      resource: { ...task, status: 'completed' },
      afterSuccessFn: () => this.snackBarService.open('Task completed'),
    });
  }

  private deleteTask(task: Task): void {
    this.store.deleteTask({
      resource: task,
      afterSuccessFn: () => this.snackBarService.open('Task deleted'),
    });
  }

  private save(task: Task): void {
    const newDescription = this.editFormGroup.value.description!;

    if (task.description !== newDescription) {
      this.store.updateTask({
        resource: { ...task, description: newDescription },
        afterSuccessFn: () => this.snackBarService.open('Task updated'),
      });
    }

    this.cancel();
  }

  private cancel(): void {
    this.editingTaskId.set(null);
    this.actions.set(DEFAULT_ACTIONS);
  }
}
