import { Router } from "express";
import { authenticate } from "../../middlewares/authenticate.middleware";
import { handleIncomingMessage, verifyWebhook } from "./whatsapp.controller";

const whatsappRoutes = Router()


whatsappRoutes.get("/webhook" , verifyWebhook)
whatsappRoutes.post("/webhook", handleIncomingMessage);


export default whatsappRoutes