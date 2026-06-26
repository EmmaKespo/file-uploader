// Write Authentication Logic
// to manage login/logout actions

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

// Display login rendering page
exports.getLogin = (req, res) => res.render('login');

// Display user sign up registration form page
exports.getRegister = (req, res) => res.render('register');

// Handle registration account creation logic
exports.postRegister = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // Hash plain password with 10 salt rounds for secure database storage
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { username, password: hashedPassword } });
    res.redirect('/auth/login');
  } catch (err) {
    res.status(400).send('Registration rejected: Username is already taken.');
  }
};

// Terminate session cookie tracking upon logout trigger
exports.postLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/auth/login');
  });
};
