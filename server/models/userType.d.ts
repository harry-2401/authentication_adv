import { Date, ObjectId } from "mongoose";

export interface UserType {
  _id?: ObjectId,
  username: string;
  email: string;
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
}
