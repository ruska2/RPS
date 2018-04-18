//INIT
let isEmpty = require('lodash.isempty');
let express = require("express");
let app =  express();
let bodyParser = require('body-parser');
var crypto = require('crypto');


app.listen(3001,() =>  console.log("Running on localhost:3001"));
app.use(bodyParser.json());

//VALIDATOR INIT
let validator = require('validator');

//SESSION
let session = require('express-session');

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'random_string_goes_here',
    resave: true,
    saveUninitialized: true,
}));
session.usernames = {};


//DB INIT
let Pool = require('pg').Pool;

let config = {
    host: 'db.dai.fmph.uniba.sk',
    user: 'ruska2@uniba.sk',
    password: 'emili123',
    database: 'playground'
};

let pool = new Pool(config);



async function getUsers() {
    return  await pool.query("SELECT * FROM \"user\"");
}

async function insertUser(username,password,email) {
    let sql = "INSERT INTO \"user\" (name,password,email,score) VALUES (\'"+ username +"\',\'"+ password +"\',\'"+ email +"\',0)";
    await pool.query(sql);
}

async function getUserScore(username) {
    let sql = "SELECT score FROM \"user\" WHERE \"user\".name = '"+ username+"'";
    return (await pool.query(sql)).rows[0].score;
}
async function getUserTeam(username) {
    let sql = "SELECT \"user\".score,team.name FROM \"user\" join team on \"user\".team_id = team.team_id WHERE \"user\".name = '"+ username+"'";
    let res = await  pool.query(sql);
    let check = res.rows[0];
    if(check === undefined){
        return ''
    }
    return res.rows[0].name;
}

async function checkIfUserIsRegistredAndPasswordIsCorrect(username,password) {
    let users  = await getUsers();
    users = users.rows;
    let correctname;

    for(let key in users){
        if(users[key].name == username){
            correctname = true;
            if(users[key].password == crypto.createHash('md5').update(password).digest("hex")){
                return true;
            }
        }
    }
    if(correctname){
        return [1,false]
    }
    return [2, false];

}

async function checkUsernameEmailNotRegistred(users,username,email) {
    let matchname = false;
    let matchmail = false;
    for(let key in users){
        if(users[key].name == username){
            matchname = true;
        }
        if(users[key].email == email){
            matchmail = true;
        }
    }
    if(matchname && matchmail) return 0;
    if(matchname) return 1;
    if(matchmail) return 2;
    return true;
}

async function validateLoginInput(data) {
    let errors = {};

    if (validator.isEmpty(data.username)) {
        errors.username = 'This field is required!';
    }
    if (validator.isEmpty(data.password)) {
        errors.password = 'This field is required!';
    }
    let res =  await checkIfUserIsRegistredAndPasswordIsCorrect(data.username, data.password);
    if (res === true) {
    }else{
        if(res[0] === 1){
            errors.password = "Password is not correct!";
        }else{
            errors.username = "Username not registred!";
        }
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}

async function validateRegsterInput(data) {
    let errors = {};
    let users = await getUsers();
    let res = await checkUsernameEmailNotRegistred(users.rows,data.username,data.email);
    if(res !== true){
        if(res === 0){
            errors.username = "Username already registred!";
            errors.email = "Email already registred!";
        }else if(res === 1){
            errors.username = "Username already registred!";
        }else{
            errors.email = "Email already registred!";
        }
    }else{
        await insertUser(data.username,crypto.createHash('md5').update(data.password).digest("hex"),data.email);
    }
    return {errors,
        isValid: isEmpty(errors)
    }
}


async function handleLogin(req,res){
    const {errors, isValid} = await validateLoginInput(req.body);
    if (!isValid) {
        res.status(200).json(errors);
    } else {
        let score = (await getUserScore(req.body.username));
        let team = (await getUserTeam(req.body.username));
        res.json({success: true, username: req.body.username, score: score, team: team});
        req.session.username = req.body.username;
        req.session.save();
    }
}

async function handleRegister(req,res){
    const {errors, isValid} = await validateRegsterInput(req.body);
    if (!isValid) {
        res.status(200).json(errors);
    } else {
        res.json({success: true, msg: "Registration succesful!"});
    }
}

async function handeGetLogged(req,res){
    if(req.session.username){
        console.log("logged:" + req.session.username);
        let score = (await getUserScore(req.session.username));
        let team = (await getUserTeam(req.session.username));
        res.status(200).json({logged: req.session.username, score: score, team: team});
    }else{
        res.status(200).json({logged: 'not'});
    }
}

app.post('/login', (req,res) => {
    return handleLogin(req,res);
});

app.post('/register', (req,res) => {
    return handleRegister(req,res);
});


app.post('/getlogged', (req,res) => {
    return handeGetLogged(req,res);
});

app.post('/remlogged', (req,res) => {
   const all = req.body;
   console.log("logout:" + all.username);
   if(all.username !== undefined){
      delete req.session.username;
   }
   res.status(200).json({user : req.session.username});
});



//STATISTICS

app.post('/getstatistics',(req,res) => {
    return handleGetStatistics(req,res);
});

async function getTopUsers(){
    let sql = "SELECT \"user\".name,\"user\".score, team.name as team_name from \"user\" left join team on team.team_id = \"user\".team_id ORDER BY \"user\".score DESC";
    let res = await pool.query(sql);
    return res;
}

async function getTopUsers(){
    let sql = "SELECT \"user\".name,\"user\".score, team.name as team_name from \"user\" left join team on team.team_id = \"user\".team_id ORDER BY \"user\".score DESC";
    let res = await pool.query(sql);
    return res;
}

async function getLastMatches(username){
    let sql = "SELECT \"user\".name,\"user\".score, team.name as team_name from \"user\" left join team on team.team_id = \"user\".team_id ORDER BY \"user\".score DESC";
    let res = await pool.query(sql);
    return res;
}



async function handleGetStatistics(req,res) {
    const username = req.body.userData.username;
    let resultTopTen = await getTopUsers();
   // let resultLastTen = await getLastMatches(username);
    res.status(200).json({topten: resultTopTen.rows/*, lastten: resultLastTen.rows*/});
}

