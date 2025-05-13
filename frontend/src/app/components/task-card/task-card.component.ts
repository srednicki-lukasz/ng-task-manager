import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Task } from '../../models/tasks.models';

@Component({
  selector: 'tm-task-card',
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCardModule, MatButtonModule],
})
export class TaskCardComponent {
  task = input.required<Task>();
  actions = input<string[]>([]);

  onAction = output<string>();
}
