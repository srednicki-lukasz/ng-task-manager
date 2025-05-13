import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../services/snack-bar.service';
import { TaskManagerStore } from '../../store/task-manager.store';

@Component({
  selector: 'tm-create-new-task',
  templateUrl: './create-new-task.component.html',
  styleUrl: './create-new-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
})
export class CreateNewTaskComponent {
  private readonly store = inject(TaskManagerStore);
  private readonly snackBarService = inject(SnackBarService);

  readonly createTaskFormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
  });

  isCreating = signal(false);

  public reset(event: Event): void {
    event.preventDefault();
    this.createTaskFormGroup.reset();
  }

  public save(): void {
    this.isCreating.set(true);

    this.store.createTask({
      resource: {
        title: this.createTaskFormGroup.value.title!,
        description: this.createTaskFormGroup.value.description!,
        status: 'active',
      },
      afterSuccessFn: () => this.snackBarService.open('Task created'),
    });
  }
}
