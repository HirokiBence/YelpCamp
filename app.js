if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const { descriptors } = require('./seeds/seedHelpers');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const expressMongooseSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbURL)
  .then(() => {
    console.log('MongoDBコネクションOK!');
  })
  .catch(err => {
    console.log('コネクションエラー！');
    console.log(err);
  })

const app = express();

/* ejs */
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* express middleware */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressMongooseSanitize());
app.use(helmet({
  contentSecurityPolicy: false,
}));


/* session store */
const secret = process.env.secret || 'mysecret'
const store = MongoStore.create({
  mongoUrl: dbURL,
  touchAfter: 24 * 3600, // time period in seconds
  crypto: {
    secret
  }
})

/* セッションエラー */
store.on = e => {
  console.log('セッションエラー', e);
}

/* session */
const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7日間
  }
}
app.use(session(sessionConfig));

/* passport */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* flash */
app.use(flash());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

/* ホーム画面 */
app.get('/', (req, res) => {
  res.render('home');
});

/* Routes */
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

/* ページが見つかりませんでした */
app.all('*', (req, res, next) => {
  next(new ExpressError('ページが見つかりませんでした', 404));
});

/* カスタムエラーハンドラ */
app.use((err, req, res, next) => {
  const { statusCode = 500} = err;
  if(!err.message){
    err.message = '問題が起きました'
  }
  res.status(statusCode).render('error',{err});
});

/* リクエストポート */
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`ポート${port}でリクエスト待機中...`);
});