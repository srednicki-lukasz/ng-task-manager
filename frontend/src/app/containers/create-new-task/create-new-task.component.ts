import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TaskManagerStore } from '../../store/task-manager.store';

@Component({
  selector: 'tm-create-new-task',
  templateUrl: './create-new-task.component.html',
  styleUrl: './create-new-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class CreateNewTaskComponent {
  private readonly store = inject(TaskManagerStore);

  readonly formGroup = new FormGroup({
    taskTitle: new FormControl('', [Validators.required]),
    taskDescription: new FormControl('', [Validators.required]),
  });

  isLoading = computed(this.computeIsLoading.bind(this));

  private computeIsLoading(store = this.store): boolean {
    return store.isLoading();
  }

  public reset(event: Event): void {
    event.preventDefault();
    this.formGroup.reset();
  }

  public save(): void {
    this.store.createTask({
      title: this.formGroup.value.taskTitle!,
      description: this.formGroup.value.taskDescription!,
      status: 'active',
    });
  }
}
