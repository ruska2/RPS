let database = require('./DBQueries');
let validator = require('./Validators');


module.exports = {
    handleLogin:
    async function handleLogin(req,res){
        const {errors, isValid} = await validator.validateLoginInput(req.body);
        if (!isValid) {
            res.status(200).json(errors);
        } else {
            let score = (await database.getUserScore(req.body.username));
            let team = (await database.getUserTeam(req.body.username));
            res.json({success: true, username: req.body.username, score: score, team: team});
            req.session.username = req.body.username;
            req.session.save();
        }
    },

    handleRegister:
    async function handleRegister(req,res){
        const {errors, isValid} = await validator.validateRegsterInput(req.body);
        if (!isValid) {
            res.status(200).json(errors);
        } else {
            res.json({success: true, msg: "Registration succesful!"});
        }
    },

    handleGetLogged:
    async function handeGetLogged(req,res){
        if(req.session.username){
            console.log("logged:" + req.session.username);
            let score = (await database.getUserScore(req.session.username));
            let team = (await database.getUserTeam(req.session.username));
            res.status(200).json({logged: req.session.username, score: score, team: team});
        }else{
            res.status(200).json({logged: 'not'});
        }
    },

    handleGetStatistics:
    async function handleGetStatistics(req,res) {
        const username = req.body.userData.username;
        let resultTopTen = await database.getTopUsers();
        let resultLastTen = await database.getLastMatches(username);
        let resultTopTeams = await database.getTopTeams();
        res.status(200).json({topten: resultTopTen.rows, lastten: resultLastTen.rows, topteams: resultTopTeams.rows});
    }
};