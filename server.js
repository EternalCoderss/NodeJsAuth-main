const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//------------ Passport Configuration kia hai------------//
require('./config/passport')(passport);

//------------ DB Configuration ------------//
const db = require('./config/key').MongoURI;

//------------ Mongo Connection kia hai------------//
mongoose.connect(db)
    .then(() => console.log("Successfully connected to MongoDB"))
    .catch(err => console.log(err));

//------------ EJS Configuration kia hai ------------//
app.use(expressLayouts);
app.use("/assets", express.static('./assets'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

//------------ Bodyparser Configuration kia hai------------//
app.use(express.urlencoded({ extended: false }))

//------------ Express session Configuration kia hai------------//
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//------------ Passport Middlewares kia hai ------------//
app.use(passport.initialize());
app.use(passport.session());

//------------ Connecting flash kia hai------------//
app.use(flash());

//------------ Global variables ------------//
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//------------ Routes ------------//
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on PORT ${PORT}`));