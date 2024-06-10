import { serializeUser, deserializeUser, use } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { findById, findOne } from "../model/users.js";

serializeUser((admin, done) => {
  done(null, admin.id);
});

deserializeUser((id, done) => {
  findById(id)
    .then((admin) => {
      done(null, admin);
    })
    .catch((err) => {
      done(err, null);
    });
});

use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:8800/api/user/google/redirect",
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      // Passport callback function
      findOne({ googleId: profile.id })
        .then((currentUser) => {
          if (currentUser) {
            done(null, currentUser);
          } else {
            new Admin({
              googleId: profile.id,
              username: profile.displayName,
              email: profile.emails[0].value,
            })
              .save()
              .then((newUser) => {
                done(null, newUser);
              });
          }
        })
        .catch((err) => {
          done(err, null);
        });
    }
  )
);
