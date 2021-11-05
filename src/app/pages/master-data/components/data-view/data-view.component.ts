import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  MasterDataGridModel,
  MasterDataResponseModel,
  PageAttrEventModel,
  PageAttrModel,
  PAGE_ATTR_DATA,
} from 'src/app/core';
import { LoaderService } from 'src/app/shared';
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
  extraDropList: any = [];
  extraFormVisible = {
    text: false,
    select: false,
  };
  errorMessage = {
    active: false,
    message: '',
  };

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
    private fBuilder: FormBuilder
  ) {
    this.masterDataForm = this.fBuilder.group({
      mainField: ['', Validators.required],
      extraField: ['', Validators.required],
      extraDropDown: [null, Validators.required],
    });

    this.detectMainFieldData();
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
      const paramList = [];
      let paramUrl = '';
      if (this.pageAttributes.pageSize > 0) {
        paramList.push(`limit=${this.pageAttributes.pageSize}`);
      }
      if (this.pageAttributes.currentPage >= 0) {
        paramList.push(`offset=${this.pageAttributes.currentPage}`);
      }

      if (paramList.length > 0) {
        paramList.map((par) => {
          paramUrl = paramUrl + par + '&';
        });
      }

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
                    active : response.is_exist,
                    message : response.message,
                  };
                } else {
                  this.errorMessage = {
                    active : response.is_exist,
                    message : response.message,
                  };
                }
              }
            });
        }
      });

    if (formSub) this.subscriptionArray.push(formSub);
  }

  public addMasterData(): void {
    const request = {
      name: this.masterDataForm.value.mainField
        ? this.masterDataForm.value.mainField
        : null,
    };
  }

  public editMasterData(rowIndex: any): void {
    console.log('INDEX =>', rowIndex);
  }

  public deleteMasterData(rowIndex: any): void {
    console.log('INDEX =>', rowIndex);
  }

  ngOnDestroy(): void {
    if (this.subscriptionArray.length > 0)
      this.subscriptionArray.map((sub) => sub.unsubscribe());
  }
}
