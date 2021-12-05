export interface AuthResponseModel {
  user: UserModel;
  token: TokenModel;
  message?: string;
  is_authenticated: boolean;
  menu: MenuModel[];
}

export interface MenuModel {
  name: string;
  icon: string;
  link: string;
  order?: number;
  children?: MenuModel[];
}

export interface TokenModel {
  refresh: string;
  access: string;
}

export interface UserModel {
  id: number;
  username: string;
  email?: string;
  is_superuser?: boolean;
  role_details: {
    name: string;
  };
  profile_pic?: string;
  first_name?: string;
  last_name?: string;
}

export interface RoleModel {
  id: number;
  is_superuser: boolean;
  name: string;
}

export interface LoggedUserModel {
  user?: UserModel;
  menu?: MenuModel[];
  token?: TokenModel;
  is_authenticated?: boolean;
}

export interface ActiveUserModel {
  user?: UserModel;
  is_authenticated?: boolean;
}

export interface ErrorResponseModel {
  headers: HeaderModel;
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  name: string;
  message: string;
  error: ErrorModel;
}

export interface ErrorModel {
  message: string;
}

export interface HeaderModel {
  normalizedNames: any;
  lazyUpdate: null;
}
