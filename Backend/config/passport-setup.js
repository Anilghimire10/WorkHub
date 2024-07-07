import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/users.js";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:8800/api/user/google/redirect",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Google profile ID:", profile.id); // Logging the profile ID
      User.findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            console.log("Current user found:", currentUser);
            done(null, currentUser);
          } else {
            new User({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              password: "", // Add a default password if required
            })
              .save()
              .then((newUser) => {
                console.log("New user created:", newUser);
                done(null, newUser);
              });
          }
        })
        .catch((err) => {
          console.error("Error in GoogleStrategy:", err);
          done(err, null);
        });
    }
  )
);
