import "dotenv/config";
import "./config/passport.config";


console.log("This is check")
import express from "express";
import cors from "cors";
import dns from "dns";
import passport from "passport";

import { Env } from "./config/app.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import authRoutes from "./modules/auth/auth.routes";
import { sessionMiddleware } from "./middlewares/session.middleware";
import userRoutes from "./modules/user/user.routes";
import whatsappRoutes from "./modules/whatsapp/whatsapp.routes";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const BASE_PATH = Env.BASE_PATH;

app.set('trust proxy', 1); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true, 
  }),
);


app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, userRoutes);
app.use(`${BASE_PATH}/whatsapp`, whatsappRoutes);

app.use(errorHandler);

export default app;