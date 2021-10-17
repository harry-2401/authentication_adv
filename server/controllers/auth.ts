import { NextFunction, Response, Request } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import ErrorResponse from "../utils/ErrorResponse";
import { sign } from "jsonwebtoken";
import { UserType } from "../models/userType";

const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;

  if (!email || !password || !username) {
    next(
      new ErrorResponse("Please provide an email, password and username", 400)
    );
  } else {
    try {
      const user: UserType = await User.create({
        username,
        email,
        password,
      });

      sendToken(user, 201, res);
    } catch (_e) {
      next(_e);
    }
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    next(new ErrorResponse("Please provide an email and password", 400));
  } else {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        next(new ErrorResponse("Invalid email", 404));
      } else {
        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          next(new ErrorResponse("Invalid password", 404));
        } else {
          sendToken(user, 200, res);
        }
      }
    } catch (_e) {
      next(_e);
    }
  }
};

const forgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.send("ForgotPassword route");
};

const resetPassword = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.send("Reser password route");
};

const sendToken = (user: UserType, statusCode: number, res: Response): void => {
  console.log(process.env.JWT_EXPIRE);
  const token = sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(statusCode).json({ success: true, token });
};

export { register, login, forgotPassword, resetPassword };
