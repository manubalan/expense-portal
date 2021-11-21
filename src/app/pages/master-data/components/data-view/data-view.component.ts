import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  MasterDataGridModel,
  MasterDataResponseModel,
  PageAttrEventModel,
  PageAttrModel,
  PAGE_ATTR_DATA,
  UpdateDataModel,
} from 'src/app/core';
import {
  DialogBoxService,
  LoaderService,
  SnackBarService,
} from 'src/app/shared';
import { endPoints } from 'src/environments/environment';
import { MasterDataViewService } from './data-view.service';

@Component({
  selector: 'ems-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss'],
})
export class DataViewComponent implements OnChanges, OnDestroy {
  columns: Array<any> = [];
  displayedColumns: Array<any> = [];
  dataSource: MasterDataResponseModel = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };
  masterDataForm: FormGroup;
  masterFilterForm: FormGroup;
  extraDropList: any = [];
  extraFormVisible = {
    text: false,
    select: false,
  };
  errorMessage = {
    active: false,
    init: true,
    message: '',
  };

  updateMode: UpdateDataModel = {
    active: false,
    selected: 0,
  };
  toggleFilterBox = false;
  paramList: string[] = [`ordering=name`];

  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

  subscriptionArray: Subscription[] = [];

  @Input() public gridInfo: MasterDataGridModel | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes.gridInfo && changes.gridInfo.currentValue) {
        this.gridInfo = changes.gridInfo.currentValue;
        this.setTableData();
      }
    }
  }

  constructor(
    private masterViewService: MasterDataViewService,
    private loaderService: LoaderService,
    private fBuilder: FormBuilder,
    private dialogeService: DialogBoxService,
    private snackBarService: SnackBarService
  ) {
    this.masterDataForm = this.fBuilder.group({
      mainField: ['', Validators.required],
      extraField: [''],
      extraDropDown: [null],
    });

    this.masterFilterForm = this.fBuilder.group({
      mainField: [''],
      extraField: [''],
      extraDropDown: [null],
    });

    this.detectMainFieldData();
    this.detectMainFilterFieldData();
  }

  public locationListOptionView(option: any): any {
    return option ? `${option.name}` : '';
  }

  private setTableData(): void {
    if (this.gridInfo && this.gridInfo.extraField) {
      if (this.gridInfo.extraField.type === 'select') {
        this.extraFormVisible.select = true;

        const dataSub = this.masterViewService
          .getFieldData(this.gridInfo.extraField.endPoint)
          .subscribe((data) => {
            if (data && data.results) {
              this.extraDropList = data.results;
            } else {
              this.extraDropList = [];
            }
          });
        this.subscriptionArray.push(dataSub);
      } else if (this.gridInfo.extraField.type === 'text')
        this.extraFormVisible.text = true;
    }

    if (this.gridInfo && this.gridInfo.apiEnd) {
      let paramUrl = '';
      if (this.pageAttributes.pageSize > 0) {
        this.paramList.push(`limit=${this.pageAttributes.pageSize}`);
      }
      if (this.pageAttributes.currentPage > 0) {
        this.paramList.push(
          `offset=${
            this.pageAttributes.currentPage * this.pageAttributes.pageSize
          }`
        );
      } else if (this.pageAttributes.currentPage === 0) {
        this.paramList.push(`offset=${this.pageAttributes.currentPage}`);
      }
      
      if (this.paramList.length > 0) {
        this.paramList.map((par) => {
          paramUrl = paramUrl + par + '&';
        });
      }
      this.paramList = [`ordering=name`];
      this.loaderService.show();
      const tableSub = this.masterViewService
        .getGridData(this.gridInfo.apiEnd + `?` + paramUrl.slice(0, -1))
        .subscribe((data) => {
          this.loaderService.hide();
          if (data) {
            this.dataSource = data;
            this.pageAttributes.totalRecord = data.count;
            this.setTable(data);
          }
        });

      this.subscriptionArray.push(tableSub);
    }
  }

  private setTable(data: MasterDataResponseModel): void {
    const columns = data.results
      .reduce((columns: any, row) => {
        return [...columns, ...Object.keys(row)];
      }, [])
      .reduce((columns: any, column: any) => {
        return columns.includes(column) ? columns : [...columns, column];
      }, []);

    this.columns = columns.map((column: any) => {
      return {
        columnDef: column,
        header: column,
        cell: (element: any) =>
          `${
            element[column]
              ? typeof element[column] === 'object'
                ? element[column].name
                : element[column]
              : ``
          }`,
      };
    });
    this.displayedColumns = this.columns.map((c) => c.columnDef);
    this.displayedColumns.shift();
    this.displayedColumns.push('actions');
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
    this.setTableData();
  }

  private detectMainFieldData(): void {
    const formSub = this.masterDataForm
      .get('mainField')
      ?.valueChanges.pipe(distinctUntilChanged(), debounceTime(800))
      .subscribe((value) => {
        if (value) {
          this.masterViewService
            .validateFieldData(
              this.gridInfo?.apiEnd ? this.gridInfo.apiEnd : '',
              value
            )
            .subscribe((response) => {
              if (response) {
                if (response.is_exist) {
                  this.errorMessage = {
                    active: response.is_exist,
                    init: false,
                    message: response.message,
                  };
                } else {
                  this.errorMessage = {
                    active: response.is_exist,
                    init: false,
                    message: response.message,
                  };
                }
              }
            });
        }
      });

    if (formSub) this.subscriptionArray.push(formSub);
  }

  public addMasterData(): void {
    if (this.gridInfo?.fields) {
      let request = this.gridInfo?.fields.reduce(
        (acc: any, curr: any) => ((acc[curr] = ''), acc),
        {}
      );

      request[this.gridInfo?.fields[0]] = this.masterDataForm.value.mainField
        ? this.masterDataForm.value.mainField
        : '';

      if (this.gridInfo?.fields.length === 2)
        request[this.gridInfo?.fields[1]] = this.masterDataForm.value.extraField
          ? this.masterDataForm.value.extraField
          : this.masterDataForm.value.extraDropDown
          ? this.masterDataForm.value.extraDropDown.id
          : '';

      this.loaderService.show();
      const tableSub = this.masterViewService
        .addMasterData(this.gridInfo.apiEnd, request, this.updateMode)
        .subscribe((response) => {
          this.setTableData();
          this.resetMasterData();
          this.snackBarService.success(
            `New ${this.gridInfo?.gridTitle} created Successfully !`,
            'Done'
          );
          this.loaderService.hide();
        });

      if (tableSub) this.subscriptionArray.push(tableSub);
    }
  }

  public resetMasterData(): void {
    this.masterDataForm.reset();
    this.updateMode = {
      active: false,
      selected: 0,
    };
    this.errorMessage = {
      active: false,
      init: true,
      message: '',
    };
  }

  public editMasterData(element: any, rowIndex: any): void {
    this.masterDataForm.patchValue(
      {
        mainField: element.name,
        extraField: element.phone,
        extraDropDown: element.state_details
          ? element.state_details
          : element.district_details
          ? element.district_details
          : '',
      },
      { emitEvent: false }
    );

    this.updateMode = { active: true, selected: element.id };
  }

  public deleteMasterData(index: number): void {
    const ref = this.dialogeService.openDialog('Are sure want to delete ?');
    ref.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && this.gridInfo?.apiEnd) {
        this.loaderService.show();
        const tableSub = this.masterViewService
          .deleteMasterData(this.gridInfo.apiEnd, index.toString())
          .subscribe((response) => {
            this.setTableData();
            this.snackBarService.success(
              `${this.gridInfo?.gridTitle} removed Successfully !`,
              'Done'
            );
            this.loaderService.hide();
          });

        if (tableSub) this.subscriptionArray.push(tableSub);
      }
    });
  }

  // Filter list
  public openFilterBox(): void {
    this.toggleFilterBox = true;
  }

  public closeFilterBox(): void {
    this.toggleFilterBox = false;
    this.masterFilterForm.reset();
    this.setTableData();
  }

  private detectMainFilterFieldData(): void {
    const formSub = this.masterFilterForm.valueChanges
      .pipe(distinctUntilChanged(), debounceTime(800))
      .subscribe((value) => {
        if (value) {
          if (value.mainField) {
            this.paramList.push(`search=${value.mainField}`);
          }
          this.setTableData();
        }
      });

    if (formSub) this.subscriptionArray.push(formSub);
  }

  public ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0)
      this.subscriptionArray.map((sub) => sub.unsubscribe());
  }
}
