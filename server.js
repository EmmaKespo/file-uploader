require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const { passport } = require('./config/passport');

const app = express();
const prisma = new PrismaClient();

// Verification block ensuring the uploads folder exists before writing files to it
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Inbound body format parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Link Express up to EJS View rendering logic engine
app.set('view engine', 'ejs');

// Setup session cookie configuration integrated directly with Prisma database model storage
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, // Sessions auto-close after 24 hours
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, // Prune stale expired records from tables every 2 mins
    dbRecordIdIsSessionId: true
  })
}));

// Initialize passport context routing lifecycle states
app.use(passport.initialize());
app.use(passport.session());

// Mount systemic routing structures onto target prefixes
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/drive'));

// Fire up open live server listening framework configurations
app.listen(3000, () => console.log('FileDrive Engine running smoothly on execution port http://localhost:${PORT}'));
