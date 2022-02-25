require('dotenv').config()
const express = require('express'),
	session = require('express-session'),
    app = express(),
    port = process.env.PORT || 3000,
    IP = process.env.IP || 'localhost',
	sessionKey = process.env.JWT_SECRET,
    cors = require("cors"),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    expbs = require("express-handlebars"),
    path = require('path'),
    flash = require('express-flash'),
    cron = require('node-cron');
    db = require("./models");


//Admin Controller
const authAdminRoute = require('./app/routes/admin/AuthRoute');


//API Controller
const authRoute = require('./app/routes/api/authRoute');
const userRoute = require('./app/routes/api/userRoute');
const productRoute = require('./app/routes/api/productRoute');
const citiesRoute = require('./app/routes/api/regionRoute');



app.use(express.static(path.resolve(__dirname, 'public')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(expressValidator);
let corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}
app.use(cors(corsOptions));
app.use(logger('dev'))
app.use(flash());
app.use(session({ 
	secret: `${sessionKey}`,
	resave: true,
	saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'app/views/admin'));

app.engine('handlebars', expbs({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'app/views/layouts'),
    helpers: require('./app/helpers/admin/handlebars-helpers.js'),
    partialsDir  : [
        //  path to your partials
        path.join(__dirname, 'app/views/partials'),
    ]
}));
//set view engine
app.set('view engine', 'handlebars');


app.get("/", (req, res) => {
    res.redirect('/admin/login');
});

app.get("/admin", (req, res) => {
    res.redirect('/admin/login');
});
app.use(function (req, res, next) {
    res.locals.session = req.session;
    next();
  });
//Admin
app.use('/admin', [
	authAdminRoute,
])


//API
app.use(process.env.PREFIX_API + '/auth', authRoute);
app.use(process.env.PREFIX_API + '/user', userRoute);
app.use(process.env.PREFIX_API + '/product', productRoute);
app.use(process.env.PREFIX_API + '/region', citiesRoute);



app.get('*', (req, res) => {
    res.send('ERROR 404 - PAGE NOT FOUND')
})

app.listen(port, IP, () => {
    console.log(`PORT IS ALIVE AND IT LISTEN TO PORT http://${IP}:${port}`)
})


  


db.sequelize.sync({alter: true});//change table but not delete table or drop table


module.exports = app
