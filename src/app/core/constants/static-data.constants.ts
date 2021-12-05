import { MasterDataGridModel } from '..';
import { PageAttrModel } from '../models/agreement-data.model';

export const ROLES = ['SUPERADMIN', 'ADMIN', 'USER'];

export const MENU = [
  {
    name: 'Dashboard',
    link: 'dashboard',
    icon: 'grid_view',
    hasAcess: [...ROLES],
  },
  {
    name: 'Agreement',
    link: 'agreement',
    icon: 'list_alt',
    hasAcess: [...ROLES],
    children: [
      {
        name: 'Agreements Details',
        link: '/dashboard/agreement/agreements-list',
        icon: 'request_quote',
      },
      {
        name: 'Vehicle Expense',
        link: '/dashboard/agreement/vehicle-expenses',
        icon: 'directions_car',
      },
      {
        name: 'Employee Expense',
        link: '/dashboard/agreement/exployee-expense',
        icon: 'groups',
      },
    ],
  },
  {
    name: 'Reports',
    link: 'reports',
    icon: 'assessment',
    hasAcess: [...ROLES],
    children: [
      {
        name: 'Employee Expense',
        link: '/dashboard/reports/exployee-wise-expense',
        icon: 'supervisor_account',
      },
      {
        name: 'Employee Expense (Date Wise)',
        link: '/dashboard/reports/exployee-expense',
        icon: 'perm_contact_calendar',
      },

      {
        name: 'Material Expense',
        link: '/dashboard/reports/vehicle-expense',
        icon: 'group_work',
      },
      {
        name: 'Vehicle Expense',
        link: '/dashboard/reports/driver-wise-expense',
        icon: 'local_shipping',
      },
      {
        name: 'Driver Expense',
        link: '/dashboard/reports/driver-expense',
        icon: 'commute',
      },
    ],
  },
  {
    name: 'Master Data',
    link: 'master-data',
    icon: 'storage',
    hasAcess: [ROLES[0], ROLES[1]],
    children: [
      {
        name: 'View Master Data',
        link: '/dashboard/master-data/view',
        icon: 'table_chart',
      },
    ],
  },
];

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
