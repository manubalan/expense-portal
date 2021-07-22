import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { AgreementListResultModel } from 'src/app/core';
import {
  DialogBoxService,
  LoaderService,
  SnackBarService,
} from 'src/app/shared/components';
import { AgreementService } from '../../services';
import { AddAgreementComponent } from '../add-agreement/add-agreement.component';

@Component({
  selector: 'ems-list-agreement',
  templateUrl: './list-agreement.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ListAgreementComponent implements OnInit, OnDestroy{
  displayedColumns: string[] = [
    'id',
    'name',
    'location_details',
    'amount',
    'action',
  ];
  agreementListData: AgreementListResultModel[] = [];

  subscriptionArray: Subscription[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService
  ) {
    this.getAgreementList();
  }

  ngOnInit(): void {
    const subjectSubs = this.agreementService.agreementUpdated$.subscribe(
      (update) => {
        if (update) {
          this.getAgreementList();
        }
      }
    );

    this.subscriptionArray.push(subjectSubs);
  }

  getAgreementList(): void {
    this.loaderService.show();
    this.agreementService.getAgreements().subscribe((data) => {
      this.loaderService.hide();
      if (data && data.results) {
        this.agreementListData = data.results;
      }
    });
  }

  editAgreement(ID: number): void {
    this.dialog.open(AddAgreementComponent).componentInstance.editMode = {
      isActive: true,
      agreementID: ID,
    };
  }

  deleteAgreement(ID: number): void {
    const ref = this.dialogeService.openDialog('Are sure want to delete ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.loaderService.show();
        const deletSubs = this.agreementService
          .deleteAgreement(ID)
          .subscribe((response) => {
            this.agreementService.agreementUpdated$.next(true);
            this.snackBarService.success(
              'Agreement removed Successfully ! ',
              'Done'
            );
            this.loaderService.hide();
          });

        this.subscriptionArray.push(deletSubs);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.forEach((subs) => {
        subs.unsubscribe();
      });
    }
  }
}
