import { NextFunction, Response, Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import User from "../models/User";
import ErrorResponse from "../utils/ErrorResponse";

const protect = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
  let token 

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  if(!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401))
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET as string)

    const user = await User.findById((decoded as JwtPayload).id)
    console.log(user)

    if(!user) {
      return next(new ErrorResponse("No user found with this id", 404))
    }
    console.log("body: ", req.body)
    console.log("headers: ", req.headers)
    req.body.user = user

    next()
  } catch (_e) {
    return next(new ErrorResponse("Not authozired to access this route", 401))
  }
}

export default protect