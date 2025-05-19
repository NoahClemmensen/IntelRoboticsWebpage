const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const indexRouter = require('./routes/web/index');
const loginRouter = require('./routes/web/login');

const usersRouter = require('./routes/api/web/users');
const robotRouter = require('./routes/api/robots/index');
const apiLoginRouter = require('./routes/api/login');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Check auth
app.use(function (req, res, next) {
    if (req.path === "/api/login" || req.path === "/login") {
        return next();
    }

    const token = req.headers['authorization']?.split(' ')[1] || req.cookies.jwtToken;
    if (!token) {
        if (req.path.startsWith('/api/')) {
            return res.status(401).json({error: 'Unauthorized: No token provided'});
        } else {
            return res.redirect('/login');
        }
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({error: 'Forbidden: Invalid token'});
        }
        req.user = decoded;
        next();
    });
});

app.use('/web', indexRouter);
app.use('/', loginRouter);
app.use('/login', loginRouter);

app.use('/api/web/users', usersRouter);
app.use('/api/login', apiLoginRouter);
app.use('/api/robots', robotRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
