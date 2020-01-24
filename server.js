const express = require('express');
const session = require('express-session');
const app = express();
const mysql = require('mysql');
const config = require('./config');
const crypto = require('crypto');
const bodyParse = require('body-parser');


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/', express.static('public'));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
 console.log(`app listening on port ${PORT}!`)
});


const auth = (req, res, next) => {
    if (session.auth) {
        next()
    }
    else {
        res.redirect('/')
    }
}

app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }))

app.get("/parts", getParts)
app.post("/login", login)
app.get("/login", renderLogin)
app.get("/", renderIndex)
async function getParts(req, res) {
    const querystr = 'SELECT * FROM Parts'
    console.log("user got to parts section")

    const connection = mysql.createConnection(config)
    connection.query(querystr, (err, rows) => {
        if (err) {
            throw err
        }
        res.json(rows)
    })
}

async function login(req, res) {
    const hash = crypto.createHash('md5')
    let userAttempt = req.body.email
    let passAttempt = req.body.password
    hash.update(passAttempt)
    const querystr = 'SELECT * FROM Users WHERE email = ? AND pass = ?'
    const connection = mysql.createConnection(config)
    connection.query(querystr, [userAttempt, hash.digest('hex')],(err, rows) => {
        if (err) {
            console.error(err)
            res.sendStatus(500)
        }
        else if (rows[0] != undefined) {
            let currentDate = new Date()
            console.log('User ' + userAttempt + ' authenticated on ' + currentDate)
            session.auth = true
            res.redirect('/login')
        }
        else {
            console.log("failed auth attempt")
            res.render('index', {data: {message: 'invalid login'}})
        }
        res.end()
    })
}

async function renderLogin(req, res) {
    res.render('login')
}

async function renderIndex(req, res) {
    res.render('index', {data: {}})
}


module.exports = {
    app: app
}