import { Date } from "mongoose";

export interface UserType {
  username: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}
