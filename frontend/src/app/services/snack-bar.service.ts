import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  private readonly snackBar = inject(MatSnackBar);

  public open(message: string): void {
    this.snackBar.open(message, 'lose', { duration: 2000 });
  }
}
