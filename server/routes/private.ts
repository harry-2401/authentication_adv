import {Router} from "express"
import getPrivateData from "../controllers/private"
import protect from "../middleware/auth"

const routerPrivate = Router()

routerPrivate.route("/").get(protect ,getPrivateData)

export default routerPrivate