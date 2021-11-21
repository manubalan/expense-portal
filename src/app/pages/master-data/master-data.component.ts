import { Component } from '@angular/core';
import { MasterDataGridModel, MASTER_DATA_GRID } from 'src/app/core';

@Component({
  selector: 'ems-master-data',
  templateUrl: './master-data.component.html',
  styleUrls: ['./master-data.component.scss'],
})
export class MasterDataComponent {
  masterDataGrids: MasterDataGridModel[] = MASTER_DATA_GRID;
}
