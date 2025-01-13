const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Determine the callback URL dynamically
const CALLBACK_URL =
  process.env.REACT_APP_ENV === "production"
    ? `${process.env.BACKEND_BASE_URL}/auth/google/callback` // Deployed backend
    : "http://localhost:5000/auth/google/callback"; // Local backend

/*const CALLBACK_URL =
  process.env.REACT_APP_ENV === "production"
    ? `${process.env.BACKEND_BASE_URL}/auth/google/callback` // Deployed backend
    : "http://localhost:5000/auth/google/callback"; // Local backend*/

/*const CALLBACK_URL =
  process.env.REACT_APP_ENV === "production"
    ? `${process.env.REACT_APP_BACKEND_URL}/auth/google/callback` // Use production backend URL from .env
    : `${process.env.REACT_APP_BASE_URL}/auth/google/callback`; // Use local backend URL for development*/

console.log(`Google OAuth Callback URL: ${CALLBACK_URL}`);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: CALLBACK_URL,
      //callbackURL: "/auth/google/callback",
      //callbackURL: "http://localhost:5000/auth/google/callback", // Replace with your production URL
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save(); // Save the new user to the database
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
