// Built in node.js
const http = require('http');

// Require third part libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');

// Initiate express app & create the server
const app = express();
const server = http.Server(app);

// Require Middlewares
const CORS = require('./middlewares/CORS');
const errors = require('./middlewares/errors');

// passportJWT setup
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const options = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_OR_KEY
};
const strategy = new JWTStrategy(options, async (payload, next) => {
  const user = await User.findOne({ _id: payload._id });
  next(null, user);
});

// User model
const User = require('./models/user');

// Require routes
const authRoute = require('./routes/authRoutes');
const protectedRoute = require('./routes/protectedRoutes');

// Body-parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
app.use(CORS);

// Use passport
passport.use(strategy);
app.use(passport.initialize());

// Use routes
app.use('/auth', authRoute);
app.use('/protected', protectedRoute);

// Error Handling
app.use(errors);

// Connect to DATABASE
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${
      process.env.DB_PASSWORD
    }@cluster0-sud5s.mongodb.net/${process.env.DB_NAME}`,
    { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true }
  )
  .then(result => {
    // Listen to server
    server.listen(process.env.PORT || 3000, () => {
      console.log(`App listening on port ${process.env.PORT || 8080}`);
    });
  })
  .catch(error => {
    console.log(error);
  });
