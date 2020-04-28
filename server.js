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
app.get("/filterDesc", filterDesc)
app.get("/filterParts", filterParts)
app.get("/filterSeries", filterSeries),
app.get("/", renderIndex)
app.get("/getParts", getParts)
app.get("/getSeries", getSeries)
app.get("/series", renderSeries)
app.get("/parts", renderParts)
app.get("/getDesc", getDesc)
app.post("/addDesc", addDesc)
app.post("/addPart", addPart)
app.post("/addSeries", addSeries)
app.post("/editDesc/:id", editDesc)
app.post("/editPart/:id", editPart)
app.post("/editSeries/:id", editSeries)

async function getParts(req, res) {
    if (session.auth) {
        let response = await sqlDb.getParts()
        res.json(response)
    }
    else {
        res.redirect('/')
    }
}

async function filterParts(req, res) {
    if (session.auth) {
        let response = await sqlDb.filterParts(req.query)
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

async function getSeries(req, res) {
    if (session.auth) {
        let response = await sqlDb.getSeries()
        res.json(response)
    }
    else {
        res.redirect('/')
    }
}

async function addSeries(req, res) {
    if (session.auth) {
        let response = await sqlDb.addSeries(req.body)
        if(response != null) {
            res.redirect('/series')
        }     
        else {
            res.render('series', {data: {message: 'Adding failed'}})
        }
        
    }
    else {
         res.redirect('/')
    }
}


async function editSeries(req, res) {
    req.body.id = req.params.id;
    console.log(req.body)
    if (session.auth) {
        let response = await sqlDb.editSeries(req.body)
        console.log(response)
        if(response != null) {
            res.redirect('/series')
        }     
        else {     
            res.render('series', {data: {message: 'Adding failed'}})
        }
        
    }
    else {
         res.redirect('/')
    }
}

async function addDesc(req, res) {
    req.body.closed = (req.body.closed == 'true')
    if (session.auth) {
        let response = await sqlDb.addDesc(req.body)
        if(response != null) {
            res.redirect('/descriptions')
        }     
        else {
            res.render('descriptions', {data: {message: 'Adding failed'}})
        }
        
    }
    else {
         res.redirect('/')
    }
}

async function filterDesc(req, res) {
    let response = await sqlDb.filterDesc(req.query)
    res.json(response);
}

async function filterSeries(req, res) {
    let response = await sqlDb.filterSeries(req.query);
    res.json(response);
}

async function addPart(req, res) {
    if(req.body.sent_to_manufacture == 0) {
        req.body.sent_to_manufacture = false
    }
    else {
        req.body.sent_to_manufacture = true
    }
    if (session.auth) {
        let response = await sqlDb.addPart(req.body)
        if(response != null) {
            res.redirect('/parts')
        }     
        else {
            res.render('parts', {data: {message: 'Adding failed'}})
        }
        
    }
    else {
         res.redirect('/')
    }
}

async function editDesc(req, res) {
    req.body.id = req.params.id;
    req.body.closed = (req.body.closed == 'true')
    if (session.auth) {
        let response = await sqlDb.editDesc(req.body)
        if(response != null) {
            res.redirect('/descriptions')
        }     
        else {     
            res.render('descriptions', {data: {message: 'Adding failed'}})
        }
        
    }
    else {
         res.redirect('/')
    }
}

async function editPart(req, res) {
    req.body.id = req.params.id;
    req.body.sent_to_manufacture = (req.body.sent_to_manufacture == 'true')
    if (session.auth) {
        let response = await sqlDb.editPart(req.body)
        if(response != null) {
            res.redirect('/parts')
        }     
        else {     
            res.render('parts', {data: {message: 'Adding failed'}})
        }
        
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
        res.render('parts', {data: {}})
    }
    else {
        res.redirect('/')
    }
}

async function renderSeries(req, res) {
    if (session.auth) {
        res.render('series', {data: {}})
    }
    else {
        res.redirect('/')
    }
}

async function renderDesc(req, res) {
        if (session.auth) {
            res.render('descriptions', {data: {}})
        }
        else {
            res.redirect('/')
        }
}

async function renderIndex(req, res) {
    res.render('index', {data: {}})
}

