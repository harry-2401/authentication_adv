import { NextFunction, Response, Request } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import ErrorResponse from "../utils/ErrorResponse";

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
    next(new ErrorResponse("Please provide an email, password and username", 400));
  }
  else {
    try {
      const user = await User.create({
        username,
        email,
        password,
      });

      console.log(user);

      res.status(201).json({ success: true, user });
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
    next(new ErrorResponse("Please provide an email and password", 400))
  }
  else {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        next(new ErrorResponse("Invalid email", 404))
      } else { 
        const isMatch: boolean = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          next(new ErrorResponse("Invalid password", 404))
        } else {
          res.status(200).json({ success: true, token: "1234567890asd" });
        }
      }
    } catch (_e) {
      next(_e)
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

export { register, login, forgotPassword, resetPassword };
