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
 console.log('app listening on port 8080!')
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

app.get("/parts", auth, (req, res)=>  {
    const querystr = 'SELECT * FROM Parts'
    console.log("user got to parts section")

    const connection = mysql.createConnection(config)
    connection.query(querystr, (err, rows) => {
        if (err) {
            throw err
        }
        res.json(rows)
    })

})




app.post("/login", (req, res) => {
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
})


app.get("/login", auth, (req, res) => {
    res.render('login')
})

app.get("/" ,(req, res) => {
    res.render('index', {data: {}})
})

module.exports = {
    app: app
}