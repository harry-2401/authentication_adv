import { NextFunction, Response, Request } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";

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

  try {
    const user = await User.create({
      username,
      email,
      password,
    });

    console.log(user)

    res.status(201).json({ success: true, user });
  } catch (_e) {
    res
      .status(500)
      .json({ success: false, error: (_e as Error).message});
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    res
      .status(400)
      .json({ success: false, error: "Please provide email and password." });
  }
  else {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        res.status(404).json({ success: false, error: "Invalid email" });
      } else {
        const isMatch: boolean = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        console.log(password, user.password);
        if (!isMatch) {
          res.status(404).json({ success: false, error: "Invalid password" });
        } else {
          res.status(200).json({ success: true, token: "1234567890asd" });
        }
      }
    } catch (_e) {
      res.status(500).json({ success: false, error: (_e as Error).message });
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
