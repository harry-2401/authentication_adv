import { NextFunction, Request, Response } from "express";

export default function getPrivateData(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res
    .status(200)
    .json({
      success: true,
      data: req.body.user,
    });
};
