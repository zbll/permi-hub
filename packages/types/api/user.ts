export interface UserLoginApi {
  email: string;
  password: string;
}

export interface UserInfoApi {
  nickname: string;
  email: string;
  createAt: Date;
}
