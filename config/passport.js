const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (passport) => {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    const { id, displayName } = profile;
    try {
      let user = await User.findOne({ googleId: id });

      if (!user) {
        user = new User({
          googleId: id,
          email: displayName
        });
        await user.save();
      }
      
      done(null, user);
    } catch (err) {
      console.error(err);
      done(err, null);
    }
  }));
};
