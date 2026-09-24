import {Router} from "express" 
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import { getMe, login, refreshController, register } from "../controller/auth.controller.js"
import { authenticate } from "../middlewares/auth.middleware.js"


const router = Router()

router.post("/register", registerValidator,register)
router.post("/login",loginValidator,login)
router.get("/refresh-token", refreshController)
router.get("/me",authenticate,getMe)


export default router