import { Router } from "express";
import passport from "passport";
import { gmailConnectCallback, googleCallback, loginUser, registerUser } from "./auth.controller";

const authRoutes = Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);

authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
  }),
);


authRoutes.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback,
);

export default authRoutes;
