import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { envVar } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

passport.use(
  new GoogleStrategy(
    {
      clientSecret: envVar.GOOGLE_CLIENT_SECRET,
      clientID: envVar.GOOGLE_CLIENT_ID,
      callbackURL: envVar.GOOGLE_CALLBACK,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          done(null, false, { message: "No Email Found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            isVerified: true,
            role: Role.USER,
            auths: [
              {
                provider: "google",
                providerId: profile.id,
              },
            ],
          });
        }
        return done(null, user);
      } catch (error) {
        console.log("Google strategy Error", error);
        return done(error);
      }
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const isUserExists = await User.findOne({ email });

        if (!isUserExists) {
          return done(null, false, { message: "User doesn't Exists" });
        }

        const isGoogleAuthenticated = isUserExists.auths.some(
          (providerObject) => providerObject.provider === "google"
        );

        if (isGoogleAuthenticated && !isUserExists.password) {
          return done(null, false, {
            message:
              "You are google authenticated before. So create a password then use email and password login",
          });
        }

        const isPassMatched = await bcrypt.compare(
          password as string,
          isUserExists.password as string
        );

        if (!isPassMatched) {
          return done(null, false, { message: "Password doesn't match.." });
        }

        return done(null, isUserExists);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }
  )
);

//process:
// frontend:localHost:5173 --> req sent to backend:localhost:5000/api/v1/auth/google --> passport --> google consent screen --> gmail logn --> successfull --> callback url: localhost:5000/api/v1/auth/google/callback --> if doesn't exists in our db then store the user in db --> then create token and sent it to the forntend: if exists then use information from the db to make a token

//bridge:
// custom login: email, password, role:USER, name, --> registration --> DB --> 1 user create
// google login: google -> req -> successfull: jwt token: email, name, role -> db store ->use token  for api access

//but the problem is google doesn't know about our app and the roles of the users and don't have access to our database

//serializing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown) => void) => {
  done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: any) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
    console.log("error from passport", error);
  }
});