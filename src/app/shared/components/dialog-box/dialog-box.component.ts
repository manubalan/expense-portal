import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ems-dialog-box',
  templateUrl: './dialog-box.component.html',
})
export class DialogBoxComponent {
  message = 'Are you sure?';
  confirmButtonText = 'Yes';
  cancelButtonText = 'Cancel';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<DialogBoxComponent>
  ) {
    if (data) {
      this.message = data.message || this.message;
      if (data.buttonText) {
        this.confirmButtonText = this.confirmButtonText;
        this.cancelButtonText = this.cancelButtonText;
        // this.confirmButtonText = data.buttonText.ok || this.confirmButtonText;
        // this.cancelButtonText = data.buttonText.cancel || this.cancelButtonText;
      }
    }
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
