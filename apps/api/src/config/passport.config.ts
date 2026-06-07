import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Env } from "./app.config";
import { googleLoginOrRegisterService } from "../modules/auth/auth.service";
import { BadRequestError } from "../utils/appError";


passport.use(
  new GoogleStrategy(
    {
      clientID: Env.GOOGLE_CLIENT_ID,
      clientSecret: Env.GOOGLE_CLIENT_SECRET,
      callbackURL: Env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        console.log("=== GOOGLE OAUTH CALLBACK ===");
        
        const googleId = profile.id;
        if (!googleId) {
          return cb(new BadRequestError("Google profile ID is missing from provider payload"), false);
        }

        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) {
          return cb(new BadRequestError("Google profile email is missing from provider payload"), false);
        }

        const name = profile.displayName || "No Name";

        const result = await googleLoginOrRegisterService({
          provider: "GOOGLE", 
          providerId: googleId,
          email,
          name,
          accessToken,
          refreshToken,
        });

        return cb(null, result.user);
      } catch (error: any) {
       
        return cb(error, false);
      }
    },
  ),
);




passport.serializeUser((user: any, done) => {
  const sessionUser = {
    id: user._id || user.id, 
    email: user.email,
    name: user.name,
    role: user.role || "user", 
  };
  done(null, sessionUser); 
});

passport.deserializeUser((sessionUser: any, done) => {
  done(null, sessionUser);
});