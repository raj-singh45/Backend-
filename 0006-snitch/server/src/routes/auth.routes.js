import {Router} from "express" 
import { loginValidator, registerValidator } from "../validators/auth.validator.js"
import { getMe, login, register } from "../controller/auth.controller.js"
import { authenticate } from "../middlware/auth.middleware.js"


const router = Router()

router.post("/register", registerValidator,register)
router.post("/login",loginValidator,login)
router.get("/me",authenticate,getMe)

export default router