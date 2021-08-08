import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import {
  AgreementListResultModel,
  PageAttrEventModel,
  PageAttrModel,
  PAGE_ATTR_DATA,
} from 'src/app/core';
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
export class ListAgreementComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = [];
  agreementListData: AgreementListResultModel[] = [];
  pageAttributes: PageAttrModel = PAGE_ATTR_DATA;

  subscriptionArray: Subscription[] = [];

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

    this.displayedColumns = [
      'agreement_number',
      'name',
      'amount',
      'expense',
      'state_details',
      'district_details',
      'location_details',
      'start_date',
      'end_date',
      'narration',
      'action',
    ];

    this.subscriptionArray.push(subjectSubs);
  }

  getAgreementList(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.pageAttributes.pageSize > 0) {
      paramList.push(`limit=${this.pageAttributes.pageSize}`);
    }
    if (this.pageAttributes.currentPage) {
      paramList.push(`offset=${this.pageAttributes.currentPage}`);
    }

    if (paramList.length > 0) {
      paramList.map((par) => {
        paramUrl = paramUrl + par + '&';
      });
    }

    this.loaderService.show();
    this.agreementService
      .getAgreements(`?` + paramUrl.slice(0, -1))
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.agreementListData = data.results;
          if (data.count) this.pageAttributes.totalRecord = data.count;
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

  handlePage(event: PageAttrEventModel): void {
    this.pageAttributes.pageSize = event.pageSize
      ? event.pageSize
      : this.pageAttributes.pageSize;
    this.pageAttributes.currentPage = event.pageIndex
      ? event.pageIndex
      : this.pageAttributes.currentPage;
    this.pageAttributes.prevPage = event.previousPageIndex
      ? event.previousPageIndex
      : this.pageAttributes.prevPage;
    this.getAgreementList();
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.forEach((subs) => {
        subs.unsubscribe();
      });
    }
  }
}
