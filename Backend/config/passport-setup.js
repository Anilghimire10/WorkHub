import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../model/users.js";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user, done) => {
  // console.log("Serializing user:", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // console.log("Deserializing user with ID:", id);
  User.findById(id)
    .then((user) => {
      // console.log("Deserialized user:", user);
      done(null, user);
    })
    .catch((err) => {
      console.error("Error during deserialization:", err);
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
      // console.log("Google profile:", profile); // Log entire profile
      User.findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            // console.log("Current user found:", currentUser);
            done(null, currentUser);
          } else {
            new User({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
              password: "", // Ensure this field is handled according to your requirements
            })
              .save()
              .then((newUser) => {
                console.log("New user created:", newUser);
                done(null, newUser);
              })
              .catch((err) => {
                console.error("Error saving new user:", err);
                done(err, null);
              });
          }
        })
        .catch((err) => {
          console.error("Error finding user:", err);
          done(err, null);
        });
    }
  )
);
