import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  success(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snack-bar-success', 'mat-primary'],
    });
  }

  error(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snack-bar-error', 'mat-accent'],
    });
  }

  warning(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: 2000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['snack-bar-warning', 'mat-warnig'],
    });
  }
}
