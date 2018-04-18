//INIT

let express = require("express");
let app =  express();
let bodyParser = require('body-parser');
let handlers = require('./serverfiles/PostHandlers');


app.listen(3001,() =>  console.log("Running on localhost:3001"));
app.use(bodyParser.json());

//SESSION
let session = require('express-session');

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'random_string_goes_here',
    resave: true,
    saveUninitialized: true,
}));




app.post('/login', (req,res) => {
    return handlers.handleLogin(req,res);
});

app.post('/register', (req,res) => {
    return handlers.handleRegister(req,res);
});


app.post('/getlogged', (req,res) => {
    return handlers.handleGetLogged(req,res);
});

app.post('/remlogged', (req,res) => {
   const all = req.body;
   console.log("logout:" + all.username);
   if(all.username !== undefined){
      delete req.session.username;
   }
   res.status(200).json({user : req.session.username});
});

app.post('/getstatistics',(req,res) => {
    return handlers.handleGetStatistics(req,res);
});



