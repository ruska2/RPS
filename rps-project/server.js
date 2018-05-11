//INIT

let express = require("express");
let app =  express();
let bodyParser = require('body-parser');
let handlers = require('./serverfiles/PostHandlers');
const socketIO = require('socket.io');
const http = require('http');
const serverApp = express();

let loggedUsers = new Map();
let games = [];


app.listen(3001,() =>  console.log("Running on localhost:3001"));
app.use(bodyParser.json());

//SESSIONnpm install express-session
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
   return handlers.handleDeleteUserTeam(req);
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

app.post('/addusertoteam', (req,res) => {
   return handlers.handleAddUserToTeam(req,res);
});

app.post('/getlogs', (req,res) => {
    return handlers.handleGetLogs(req,res);
});

app.post('/deleteuser', (req,res) =>{
   return handlers.handleDeleteUser(req,res);
});

app.post('/deleteteam', (req,res) =>{
    return handlers.handleDeleteTeam(req,res);
});

const server = http.createServer(serverApp);
const io = socketIO(server);
server.listen(4000, () => console.log(`Listening on port 4000`));

io.on('connection', socket => {
    console.log('User connected');

    socket.on('logout', (name) => {
        console.log('user disconnected:' + name);
        console.log(loggedUsers.size);
        if(loggedUsers.size > 1){
            console.log("leavedfromgame");
            loggedUsers.get(name).emit('lose', "You lost!");
            loggedUsers.delete(name);
            loggedUsers.get(loggedUsers.keys().next().value).emit('win', "You win!");
            loggedUsers = new Map();
            games = [];
        }else{
            loggedUsers.delete(name);
        }

    });

    socket.on('login', name =>{
        console.log("findgame:" + name);
        loggedUsers.set(name,socket);
        console.log(loggedUsers.size);
        if(loggedUsers.size % 2 === 0){
            let user1 = loggedUsers.keys().next().value;
            let user2 = name;
            console.log("initgame:"+user1.toString()+" vs " + user2.toString());
            let init = generateNewGame(user1,user2);
            loggedUsers.get(user1).emit('init',init);
            loggedUsers.get(user2).emit('init',init);
            let game = [];
            game.push(user1,user2,init);
            games.push(game);
        }
    });

    socket.on('move', move =>{
        console.log(move);
        //CHANGE GAME MAP AND INIT
        //DECIDER FUNCION
        //SEND BACK INIT
        let user1 = games[0][0];
        let user2 = games[0][1];
        let game = games[0][2];
        let user = move[0];
        let oldpos = move[1];
        let newpos = move[2];

        let split = oldpos.split(' ');
        let oldi = parseInt(split[1]);
        let oldj = parseInt(split[2]);

        let split2 = newpos.split(' ');
        let newi = parseInt(split[1]);
        let newj = parseInt(split[2]);

        if(user1 === user){
            for()
        }
        else if(user2 === user){

        }

    });

});


function generateNewGame(user1,user2) {
    let move = {};
    let user1positions = [];
    let user2positions = [];
    for(let i = 0; i < 2; i++){
        for(let j = 0; j < 5; j++){
            user1positions.push([i,j,Math.floor((Math.random() * 3) + 0)])
        }
    }


    for(let i = 5; i < 7; i++){
        for(let j = 0; j < 5; j++){
            user2positions.push([i,j,Math.floor((Math.random() * 3) + 0)])
        }
    }

    move.user1points = user1positions;
    move.user2points = user2positions;
    move.move = user1;
    move.user1 = user1;
    move.user2 = user2;


    return move;
}
