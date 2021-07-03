export interface AuthResponseModel {
  user: UserModel;
  token: TokenModel;
  message: string;
}

export interface TokenModel {
  refresh: string;
  access: string;
}

export interface UserModel {
  id: number;
  username: string;
  email: string;
  is_superuser: boolean;
  profile_pic: null;
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
