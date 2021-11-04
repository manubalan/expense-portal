import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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
export class DataViewComponent implements OnInit {
  columns: Array<any> = [];
  displayedColumns: Array<any> = [];
  dataSource: MasterDataResponseModel = {
    count: 0,
    next: null,
    previous: null,
    results: [],
  };

  expandedElement: any;

  pageAttributes: PageAttrModel = { ...PAGE_ATTR_DATA };

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
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {}

  private setTableData(): void {
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
      this.masterViewService
        .getGridData(this.gridInfo.apiEnd + `?` + paramUrl.slice(0, -1))
        .subscribe((data) => {
          this.loaderService.hide();
          if (data) {
            this.dataSource = data;
            this.pageAttributes.totalRecord = data.count;
            this.setTable(data);
          }
        });
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

  public editMasterData(rowIndex: any): void {
    console.log('INDEX =>', rowIndex);
  }

  public deleteMasterData(rowIndex: any): void {
    console.log('INDEX =>', rowIndex);
  }
}
