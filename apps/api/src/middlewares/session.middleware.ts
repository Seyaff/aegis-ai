import session from "express-session";
import {RedisStore} from "connect-redis";
import { createClient } from "redis";
import { Env } from "../config/app.config";


const redisClient = createClient({
  url: Env.REDIS_URI, 
});

redisClient.connect()
  .then(() => console.log("🚀 Connected to Upstash Redis successfully!"))
  .catch((err: any) => console.error("❌ Redis Connection Failure:", err));


const redisStore = new RedisStore({
  client: redisClient,
  prefix: "aegis_sess:",
});

export const sessionMiddleware = session({
  name: "aegis",
  secret: Env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: redisStore,

  cookie: {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000, 
  },
});