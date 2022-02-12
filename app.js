if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongu = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const userRouter = require('./routes/users');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/user');
const dbUrl = process.env.DB_URL;
const MongoStore = require('connect-mongo');


const secret = process.env.SECRET || 'thissmongohouldbebettersecret!';

const mongoConfig = {
    mongoUrl: dbUrl,
    touchAfter: 3 * 60, // 3min
    secret
}

const store = MongoStore.create(mongoConfig);

store.on("error", function (e) {
    console.log("session store error", e)
});

mongu.connect(dbUrl, {
});

const db = mongu.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
    console.log("DB connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    name: 'session',
    secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 10000 * 60 * 60 * 24 * 7,
        maxAge: 10000 * 60 * 60 * 24 * 7
    },
    store
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.send('HI');
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({
        email: 'sororiri@gmail.com',
        username: 'sang yun'
    })
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
});

app.use('/', userRouter);
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

app.use(async (err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message)
        err.message = 'Oh No, Something went wroung';
    res.status(statusCode);
    res.render('error', { err });
});

app.listen(3000, () => {
    console.log('Server on prot 3000')
})
