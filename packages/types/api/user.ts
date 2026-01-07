export interface UserLoginApi {
  email: string;
  password: string;
}

export interface UserInfoApi {
  nickname: string;
  email: string;
  createAt: Date;
  lastLoginAt?: Date;
}

export interface UserItemApi {
  id: string;
  nickname: string;
  email: string;
  ip: string;
  roles: Array<{
    id: string;
    role: string;
  }>;
  createAt: Date;
  lastLoginAt?: Date;
}

export interface UserAddApi {
  nickname: string;
  email: string;
  password: string;
  confirmPassword: string;
  emailCode: string;
  roles: number[];
}

export interface CurrentUserEditApi {
  nickname: string;
  email: string;
}
