import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxComponent } from './dialog-box.component';

@Injectable({
  providedIn: 'root',
})
export class DialogBoxService {
  constructor(private dialog: MatDialog) {}

  openDialog(msg: string): any {
    const dialogRef = this.dialog.open(DialogBoxComponent, {
      data: {
        message: msg,
        buttonText: {
          ok: 'Save',
          cancel: 'No',
        },
      },
    });

    return dialogRef;

    // dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    //   if (confirmed) {
    //     const a = document.createElement('a');
    //     a.click();
    //     a.remove();
    //   }
    // });
  }

  // openAlertDialog() {
  //   const dialogRef = this.dialog.open(AlertDialogComponent, {
  //     data: {
  //       message: 'HelloWorld',
  //       buttonText: {
  //         cancel: 'Done',
  //       },
  //     },
  //   });
  // }
}
