import express, { Router } from "express"
import { forgotPassword, login, register, resetPassword } from "../controllers/auth"
const router: Router = express.Router()

router.route("/register").post(register)

router.route("/login").post(login);

router.route("/forgotpassword").post(forgotPassword);

router.route("/resetpassword/:resetToken").put(resetPassword);




export default router