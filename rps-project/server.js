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


//POST HANDLING
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
   return handlers.handleLogout(req,res);
});

app.post('/getstatistics',(req,res) => {
    return handlers.handleGetStatistics(req,res);
});

app.post('/deleteuserteam', (req,res) =>{
   return handlers.handleDeleteTeam(req);
});

app.post('/getteamexists',(req,res) => {
   return handlers.handleGetTeamExists(req,res);
});

app.post('/addteam',(req,res) => {
    return handlers.handleAddTeam(req,res);
});

app.post('/getteams', (req,res) =>{
    return handlers.handleGetTeams(res);
});
