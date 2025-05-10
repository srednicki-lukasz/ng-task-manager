import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Task } from '../../models/tasks.models';
import { TaskManagerStore } from '../../store/task-manager.store';

@Component({
  selector: 'tm-active-tasks',
  templateUrl: './active-tasks.component.html',
  styleUrl: './active-tasks.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
  ],
})
export class ActiveTasksComponent implements OnInit {
  private readonly store = inject(TaskManagerStore);

  readonly formGroup = new FormGroup({
    taskDescription: new FormControl('', [Validators.required]),
  });

  isEditing = signal(false);
  isLoading = computed(this.computeIsLoading.bind(this));
  activeTasks = computed(this.computeActiveTasks.bind(this));

  private computeIsLoading(store = this.store): boolean {
    return store.isLoading();
  }

  private computeActiveTasks(store = this.store): Task[] {
    return store.activeTasks();
  }

  public ngOnInit(): void {
    this.store.fetchTasks('active');
  }

  public completeTask(task: Task): void {
    this.store.updateTask({ ...task, status: 'completed' });
  }

  public deleteTask(id: string): void {
    this.store.deleteTask(id);
  }

  public editTask(task: Task): void {
    this.isEditing.set(true);
    this.formGroup.setValue({ taskDescription: task.description });
  }

  public cancel(): void {
    this.isEditing.set(false);
  }

  public save(task: Task): void {
    const newDescription = this.formGroup.value.taskDescription!;
    if (task.description !== newDescription) this.store.updateTask({ ...task, description: newDescription });
    this.isEditing.set(false);
  }
}
