import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  AgreementListResultModel,
  MasterDataService,
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
  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];
  hasResult = false;
  agreementFilterForm: FormGroup;

  agreementList: any[] = [];
  nameList: any[] = [];
  locationList: any[] = [];

  constructor(
    public dialog: MatDialog,
    private agreementService: AgreementService,
    private loaderService: LoaderService,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService,
    private fBuilder: FormBuilder,
    private masterService: MasterDataService
  ) {
    this.agreementFilterForm = this.fBuilder.group({
      agreement: new FormControl(null),
      location: new FormControl(null),
    });

    this.setFilterLists();
    this.searchNow();
  }

  ngOnInit(): void {
    const subjectSubs = this.agreementService.agreementUpdated$.subscribe(
      (update) => {
        if (update) {
          this.searchNow();
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
    if (event.pageIndex !== undefined)
      this.pageAttributes.currentPage =
        event.pageIndex >= 0
          ? event.pageIndex
          : this.pageAttributes.currentPage;
    this.pageAttributes.prevPage = event.previousPageIndex
      ? event.previousPageIndex
      : this.pageAttributes.prevPage;
    this.searchNow();
  }

  // Filter Functions
  public employeeOptionView(option: any): string {
    return option ? option.name : '';
  }

  public agreementOptionView(option: any): string {
    return option ? `${option.agreement_number} - ${option.name}` : '';
  }

  setFilterLists(): void {
    this.setAgreementList();
    this.setEmployeeList();
    this.setLocationList();
    this.detectFilterForms();
  }

  setAgreementList(search?: string): void {
    const agreementSubs = this.agreementService
      .getAgreements(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        if (data && data.results) {
          this.agreementList = data.results;
        }
      });

    this.subscriptionArray.push(agreementSubs);
  }

  setEmployeeList(search?: string): void {
    this.loaderService.show();
    const empSubs = this.masterService
      .getEmployeesList(
        search !== null && search !== undefined
          ? `?search=${search}`
          : undefined
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.nameList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  setLocationList(search?: string): void {
    this.loaderService.show();
    const empSubs = this.masterService
      .getLocationsList(
        0,
        search !== null && search !== undefined ? `search=${search}` : undefined
      )
      .subscribe((data) => {
        this.loaderService.hide();
        if (data && data.results) {
          this.locationList = data.results;
        }
      });
    this.subscriptionArray.push(empSubs);
  }

  detectFilterForms(): void {
    const detectSubs = this.agreementFilterForm
      .get('agreement')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setAgreementList(value);
      });
    if (detectSubs) this.subscriptionArray.push(detectSubs);

    const empSubs = this.agreementFilterForm
      .get('name')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setEmployeeList(value);
      });
    if (empSubs) this.subscriptionArray.push(empSubs);

    const workSubs = this.agreementFilterForm
      .get('location')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => {
        if (typeof value === 'string') this.setLocationList(value);
      });
    if (workSubs) this.subscriptionArray.push(workSubs);
  }

  searchNow(): void {
    const paramList = [];
    let paramUrl = '';
    if (this.pageAttributes.pageSize > 0) {
      paramList.push(`limit=${this.pageAttributes.pageSize}`);
    }
    if (this.pageAttributes.currentPage > 0) {
      paramList.push(
        `offset=${
          this.pageAttributes.currentPage * this.pageAttributes.pageSize
        }`
      );
    } else if (this.pageAttributes.currentPage === 0) {
      paramList.push(`offset=${this.pageAttributes.currentPage}`);
    }

    if (
      this.agreementFilterForm.value.agreement &&
      this.agreementFilterForm.value.agreement.id
    ) {
      paramList.push(
        `agreement_number=${this.agreementFilterForm.value.agreement.agreement_number}`
      );
    }

    if (
      this.agreementFilterForm.value.location &&
      this.agreementFilterForm.value.location.id
    ) {
      paramList.push(`location=${this.agreementFilterForm.value.location.id}`);
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
          this.hasResult = data.results.length > 0 ? true : false;
          if (data.count) this.pageAttributes.totalRecord = data.count;
        }
      });
  }

  resetSearch(): void {
    this.agreementFilterForm.reset();
    this.pageAttributes.pageSize = this.pageAttributes.pageSizeOpt[0];
    this.pageAttributes.currentPage = 0;
    this.searchNow();
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0) {
      this.subscriptionArray.forEach((subs) => {
        subs.unsubscribe();
      });
    }
  }
}
