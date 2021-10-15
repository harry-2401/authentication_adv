import { NextFunction, Response, Request } from "express";
import User from "../models/User";

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { username, email, password }: { username: string, email: string, password: string } = req.body

  try {
    const user = await User.create({
      username,
      email,
      password
    })

    res.status(201).json({success: true, user})
  } catch (_e) {
    res.status(500).json({success: false, error: (_e as Error).message })
  }
}

const login = (req: Request, res: Response, next: NextFunction): void => {
  res.send("Login Route")
}

const forgotPassword = (req: Request, res: Response, next: NextFunction): void => {
  res.send("ForgotPassword route")
}

const resetPassword = (req: Request, res: Response, next: NextFunction): void => {
  res.send("Reser password route")
}

export {register, login, forgotPassword, resetPassword}