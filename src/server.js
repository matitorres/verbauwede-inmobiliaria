const express = require('express')
const path = require('path')
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const morgan = require('morgan')
const multer = require('multer')
const storage = multer.memoryStorage()
// const storage = require('./helpers/customStorage')({
//     destination: function (req, file, cb) {
//         const urlBase = 'src/public/upload/'
//         const urlFile = req.body.address + ' - ' + req.body.city + ', ' + req.body.province + '/' + file.originalname
//         cb(null, path.resolve( urlBase + urlFile ))
//     }
// })
const upload = multer({ storage })
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const passport = require('passport');
const { ProcessCredentials } = require('aws-sdk');

// Init
const app = express()
require('./config/passport')

// Settings
app.set('port', process.env.PORT || '3000')
app.set('views', path.join(__dirname, 'views'))
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    partialsDir: path.join(app.get('views'), 'partials'),
    layoutsDir: path.join(app.get('views'), 'layouts'),
    extname: '.hbs',
    helpers: require('./helpers/hbs'),
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set('view engine', '.hbs')

// Middlewares
app.use(morgan('dev'))
app.use(upload.fields([{ name: 'propertyPhoto', maxCount: 1 }, { name: 'propertyPhotos', maxCount: 13 }]))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// Global variables
app.use((req, res, next) => {
    res.locals.msg_success = req.flash('msg_success')
    res.locals.msg_error = req.flash('msg_error')
    res.locals.client_msg_success = req.flash('client_msg_success')
    res.locals.client_msg_error = req.flash('client_msg_error')
    res.locals.error = req.flash('error')
    res.locals.admin = req.admin || null
    res.locals.user = req.user || null
    next()
})

// Routes
app.use(require('./routes/client.routes'))
app.use(require('./routes/admin.routes'))
app.use(require('./routes/property.routes'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

module.exports = app
