const express = require('express');
const session = require('express-session');
const app = express();
const crypto = require('crypto');
const bodyParse = require('body-parser');
const server = require('http').createServer(app)
const sqlDb = require('./dbscript.js')

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/', express.static('public'));
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
 console.log(`app listening on port ${PORT}!`)
});

module.exports = server;


app.use(bodyParse.json());
app.use(bodyParse.urlencoded({ extended: false }))

app.post("/descriptions", login)
app.get("/descriptions", renderDesc)
app.get("/", renderIndex)
app.get("/getParts", getParts)
app.get("/parts", renderParts)
app.get("/getDesc", getDesc)
app.post("/addDesc", addDesc)


async function getParts(req, res) {
    console.log(req.body)
    if (session.auth) {
        let response = await sqlDb.getParts()
        res.json(response)
    }
    else {
        res.redirect('/')
    }
}

async function getDesc(req, res) {
    if (session.auth) {
        let response = await sqlDb.getDesc()
        res.json(response)
    }
    else {
        res.redirect('/')
    }
}

async function addDesc(req, res) {
    if(req.body.closed == undefined) {
        req.body.closed = false
    }
    else {
        req.body.closed = true
    }
    if (session.auth) {
        let response = await sqlDb.addDesc(req.body)
        res.json(response)
    }
    else {
         res.redirect('/')
    }
}

async function login(req, res) {
    const hash = crypto.createHash('md5')
    let userAttempt = req.body.email
    let passAttempt = req.body.password
    hash.update(passAttempt)
    let attempt = await sqlDb.getUser(userAttempt, hash.digest('hex'))
    if (attempt instanceof Error === false) {
        let currentDate = new Date()
        console.log('User ' + attempt[0].email + ' authenticated on ' + currentDate)
        session.auth = true
        res.redirect('/descriptions')
    }
    else {
        console.log("failed auth attempt")
        res.render('index', {data: {message: 'invalid login'}})
    }

}

async function renderParts(req, res) {
    if (session.auth) {
        res.render('parts')
    }
    else {
        res.redirect('/')
    }
}

async function renderDesc(req, res) {
        if (session.auth) {
            res.render('descriptions')
        }
        else {
            res.redirect('/')
        }
}

async function renderIndex(req, res) {
    res.render('index', {data: {}})
}

