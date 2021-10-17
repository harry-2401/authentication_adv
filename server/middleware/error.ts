import ErrorResponse from "../utils/ErrorResponse";
import { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (err, req, res, next): void => {
  let error: ErrorResponse = { ...err}

  error.message = err.message
  console.log("Error", error)
  console.log("err", err)

  if(err.code === 11000) {
    const message: string = "Duplicate field value Enter"
    error = new ErrorResponse(message, 400)
  }
  
  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "Server error" });
}

export default errorHandler