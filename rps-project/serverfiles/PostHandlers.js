let database = require('./DBQueries');
let validator = require('./Validators');


module.exports = {
    handleLogin:
        async function handleLogin(req, res) {
            const {errors, isValid} = await validator.validateLoginInput(req.body);
            if (!isValid) {
                res.status(200).json(errors);
            } else {
                let score = (await database.getUserScore(req.body.username));
                let team = (await database.getUserTeam(req.body.username));
                res.json({success: true, username: req.body.username, score: score, team: team});
                req.session.username = req.body.username;
                req.session.save();
                database.logLogin(req.body.username);
            }
        },

    handleLogout:
        async function handleLogout(req, res) {
            const data = req.body;
            console.log("logout:" + data.username);
            if (data.username !== undefined) {
                delete req.session.username;
                database.logLogout(data.username);
            }
            res.status(200).json({user: req.session.username});
        },

    handleRegister:
        async function handleRegister(req, res) {
            const {errors, isValid} = await validator.validateRegsterInput(req.body);
            if (!isValid) {
                res.status(200).json(errors);
            } else {
                res.json({success: true, msg: "Registration succesful!"});
            }
        },

    handleGetLogged:
        async function handeGetLogged(req, res) {
            if (req.session.username) {
                console.log("logged:" + req.session.username);
                let score = (await database.getUserScore(req.session.username));
                let team = (await database.getUserTeam(req.session.username));
                res.status(200).json({logged: req.session.username, score: score, team: team});
            } else {
                res.status(200).json({logged: 'not'});
            }
        },

    handleGetStatistics:
        async function handleGetStatistics(req, res) {
            const username = req.body.userData.username;
            try {
                let resultTopTen = await database.getTopUsers();
                let resultLastTen = await database.getLastMatches(username);
                let resultTopTeams = await database.getTopTeams();
                let userPostition = await database.getUserPosition(username);
                let topTenInTeam = await database.getTopTenInTeam(username);
                let posInTeam = await  database.getPositionInTeam(username);
                res.status(200).json({
                    topten: resultTopTen.rows,
                    lastten: resultLastTen.rows,
                    topteams: resultTopTeams.rows,
                    position: userPostition,
                    topteninteam: topTenInTeam,
                    posinteam: posInTeam
                });
            } catch (e) {
                console.log(e);
            }
        },

    handleDeleteUserTeam:
        async function handleDeleteTeam(req) {
            const username = req.body.name;
            await database.logLeaveTeam(username);
            await database.deleteUserTeam(username);

        },

    handleGetTeamExists:
        async function handleGetTeamExists(req, res) {
            const teamname = req.body.name;
            let result = await database.getTeamExists(teamname);
            if (result) {
                res.status(200).json({succes: true});
            }
            else {
                res.status(200).json({error: "Team already registred!"});
            }
        },

    handleAddTeam:
        async function handleAddTeam(req) {
            const name = req.body.name;
            const team = req.body.team;
            const id = (await database.addTeam(team)).rows[0].team_id;
            await database.updateUserTeam(name, id);
            database.logCreateTeam(id, name);
        },

    handleGetTeams:
        async function handleGetTeams(res) {
            let result = await database.getTeams();
            res.status(200).json({teams: result.rows});
        },

    handleAddUserToTeam:
        async function handleAddUserToTeam(req, res) {
            const name = req.body.username;
            const team = req.body.teamname;
            await database.updateUserTeamByName(name, team);
            await database.logJoinTeam(name, team);
            res.status(200).json({succes: true});
        },

    handleGetLogs:
        async function handleGetLogs(req, res) {
            let rows = (await database.getLogs()).rows;
            let users = (await database.getUsersLog());
            let teams = (await database.getAllTeams());
            let games = (await database.getGames());
            res.status(200).json([rows, users, teams, games]);
        },

    handleDeleteUser:
        async function handleDeleteUser(req, res) {
            let dbres = await (database.deleteUser(req.body.name));
            if(dbres.rows.length === 1){
                let errors = {succes: true};
                res.status(200).json({errors: errors});
            }else{
                let errors = {deleteuser: 'Username does not exist in database!'};
                res.status(200).json({errors: errors});
            }
        },

    handleDeleteTeam:
        async function handleDeleteTeam(req, res) {
            let dbres = await (database.deleteTeam(req.body.name));
            if(dbres.rows.length === 1){
                let errors = {succes: true};
                res.status(200).json({errors: errors});
            }else{
                let errors = {deleteteam: 'Teamname does not exist in database!'};
                res.status(200).json({errors: errors});
            }
        },

    updateAddUserScore:
        async function updateAddUserSscore(name) {
            return await database.updateAddUserScore(name);
        },

    updateSubUserScore:
        async function updateSubUserSscore(name) {
            return await database.updateSubUserScore(name);
        },


    addGame:
        async function addGame(winner,loser){
            return (await database.addGame(winner,loser));
        },

    getUserId:
        async function getUserId(name){
            let id = await database.getUserId(name);
            return id;
        }


};