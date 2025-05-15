const passport=require('passport')
const User=require('../models/user')
const GoogleStrategy=require('passport-google-oauth20').Strategy
const FacebookStrategy=require('passport-facebook').Strategy
const GitHubStrategy=require('passport-github2').Strategy

require('dotenv').config()


async function saveUser(profile, done) {
  try {
    let existingUser = await User.findOne({ providerId: profile.id });

    if (!existingUser) {
      const newUser = new User({
        name: profile.displayName,
        email: profile.emails?.[0]?.value || '',
        provider: profile.provider,
        providerId: profile.id
      });
      existingUser = await newUser.save();
    }

    done(null, existingUser._id); 
  } catch (err) {
    done(err, null);
  }
}


passport.serializeUser((userId, done) => done(null, userId));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:`${process.env.BACKEND_URL}/auth/google/callback`,
},(accessToken,refreshToken,profile,done)=>{
    saveUser(profile,done)
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name'],
}, (accessToken, refreshToken, profile, done) => saveUser(profile, done)));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/github/callback`,
}, (accessToken, refreshToken, profile, done) => saveUser(profile, done)));