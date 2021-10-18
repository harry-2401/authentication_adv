import { NextFunction, Response, Request } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import ErrorResponse from "../utils/ErrorResponse";
import { sign } from "jsonwebtoken";
import { UserType } from "../models/userType";
import crypto from "crypto"
import sendEmail from "../utils/sendEmail";

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
        const isMatch: boolean = await bcrypt.compare(password, user.password as string);
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

const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { email }: {email: string} = req.body
  try {
    const user = await User.findOne({email})

    if(!user) {
      return next(new ErrorResponse("Email could not be sent", 404))
    }
    
    const resetToken: string = crypto.randomBytes(30).toString("hex");
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save()

    const resetUrl: string = `http://localhost:3000/passwordreset/${resetToken}`
    const message: string = `
      <h1>You have requested a password reset</h1>
      <p> Please go to the link to reset your password</p>
      <a href=${resetUrl} clicktacking=off>${resetUrl}</a>
    `

    try {
      await sendEmail({
        to: user.email,
        subject: "Password reset request",
        html: message
      })

      res.status(200).json({success: true, data: "email sent"})
    } catch (error) {
      user.resetPasswordExpire = undefined
      user.resetPasswordToken = undefined

      user.save()

      return next(new ErrorResponse("Email could not be sent", 500))
    }
  } catch (_e) {
    next(_e)
  }
};

const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const resetPasswordToken: string = crypto.createHash('sha256').update(req.params.resetToken).digest('hex')
  const now: Date = new Date(Date.now())
  try {
    const user = await User.findOne({resetPasswordToken, resetPasswordExpire: { $gt: now}})

    if(!user) {
      return next(new ErrorResponse("Invalid Reset Token", 400))
    }

    user.password = req.body.password
    user.resetPasswordExpire = undefined
    user.resetPasswordToken = undefined

    user.save()

    res.status(201).json({
      success: true, 
      data: "Password Reset Success"
    })
  } catch (error) {
    return next(error)
  }
};

const sendToken = (user: UserType, statusCode: number, res: Response): void => {
  console.log(process.env.JWT_EXPIRE);
  const token = sign({ id: user._id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  res.status(statusCode).json({ success: true, token });
};

export { register, login, forgotPassword, resetPassword };
