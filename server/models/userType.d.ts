import { ObjectId } from "mongoose";

export interface UserType {
  _id?: ObjectId,
  username: string;
  email: string;
  password: string;
  resetPasswordToken?: string | undefined;
  resetPasswordExpire?: Date | undefined;
}
