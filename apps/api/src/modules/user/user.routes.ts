import { Router } from "express";
import { getMe } from "./user.controller";
import { authenticate } from "../../middlewares/authenticate.middleware";


const userRoutes = Router()

userRoutes.use(authenticate)


userRoutes.get("/me" , getMe)

export default userRoutes