 // Configure Passport Authentication Strategy
 // to handle your secure user login strategy.

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define local strategy validation logic
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return done(null, false, { message: 'Incorrect username.' });

    // Compare user input plaintext password with saved hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return done(null, false, { message: 'Incorrect password.' });

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Save the unique user id inside the session cookie
passport.serializeUser((user, done) => done(null, user.id));

// Retrieve user account information based on the incoming session cookie id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Route guard middleware to block guests from protected paths
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/login');
}

module.exports = { passport, isAuthenticated };
