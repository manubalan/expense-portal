import { MasterDataGridModel } from '..';
import { PageAttrModel } from '../models/agreement-data.model';

export const ROLES = ['SUPERADMIN', 'ADMIN', 'USER'];

export const QUANTITY_TYPES = [
  {
    id: 1,
    label: 'Count',
    value: 'Count',
  },
  {
    id: 2,
    label: 'Cubic',
    value: 'Cubic',
  },
  {
    id: 3,
    label: 'Kilo Grams',
    value: 'Kg',
  },
];

export const DAY_TYPES = [
  {
    id: 1,
    label: 'Full',
    value: 'Full',
  },
  {
    id: 2,
    label: 'Half',
    value: 'Half',
  },
  {
    id: 3,
    label: 'Over Time',
    value: 'Over-time',
  },
];

export const PAGE_ATTR_DATA: PageAttrModel = {
  totalRecord: 0,
  currentPage: 0,
  prevPage: 0,
  pageSize: 10,
  pageSizeOpt: [10, 25, 50, 100, 200, 250],
  firstLastEnable: true,
};

export const MASTER_DATA_GRID: MasterDataGridModel[] = [
  {
    gridTitle: 'Employee',
    apiEnd: 'employees',
    fieldLabels: ['Name', 'Phone'],
    fields: ['name', 'phone'],
    extraField: {
      endPoint: 'phone',
      type: 'text',
    },
  },
  {
    gridTitle: 'Vechicle Type',
    apiEnd: 'vehicle-types',
    fieldLabels: ['Vechicle Type'],
    fields: ['name'],
  },
  {
    gridTitle: 'Materials',
    apiEnd: 'materials',
    fieldLabels: ['Materials'],
    fields: ['name'],
  },
  {
    gridTitle: 'Work Type',
    apiEnd: 'worktypes',
    fieldLabels: ['Work Type'],
    fields: ['name'],
  },
  {
    gridTitle: 'Si Units',
    apiEnd: 'si-units',
    fieldLabels: ['Si Units'],
    fields: ['name'],
  },
  {
    gridTitle: 'Work Day Type',
    apiEnd: 'work-day-types',
    fieldLabels: ['Work Day Type'],
    fields: ['name'],
  },
  {
    gridTitle: 'states',
    apiEnd: 'states',
    fieldLabels: ['States'],
    fields: ['name'],
  },
  {
    gridTitle: 'districts',
    apiEnd: 'districts',
    fieldLabels: ['Districts', 'States'],
    fields: ['name', 'state'],
    extraField: {
      endPoint: 'states/',
      type: 'select',
    },
  },
  {
    gridTitle: 'Location',
    apiEnd: 'locations',
    fieldLabels: ['Location', 'Districts'],
    fields: ['name', 'district'],
    extraField: {
      endPoint: 'districts/',
      type: 'select',
    },
  },
];
