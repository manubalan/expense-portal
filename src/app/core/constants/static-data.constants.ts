import { PageAttrModel } from '../models/agreement-data.model';

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
  pageSize: 25,
  pageSizeOpt: [25, 50, 100, 200, 250],
  firstLastEnable: true,
};
