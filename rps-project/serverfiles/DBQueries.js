let Pool = require('pg').Pool;

let config = {
    host: 'db.dai.fmph.uniba.sk',
    user: 'ruska2@uniba.sk',
    password: 'emili123',
    database: 'playground'
};

let pool = new Pool(config);

module.exports ={
    getTopUsers : async function getTopUsers(){
        let sql = "SELECT \"user\".name,\"user\".score, team.name as team_name from \"user\" left join team on team.team_id = \"user\".team_id WHERE \"user\".name != 'admin123' ORDER BY \"user\".score DESC";
        return await pool.query(sql);
    },


    getLastMatches: async function getLastMatches(username){
        let sql = "SELECT wu.name as winner, lu.name as loser, gam.score as score, time from game as gam join \"user\" as wu on winner_id = wu.user_id join \"user\" as lu on loser_id = lu.user_id "+
            "WHERE gam.winner_id = (SELECT user_id from \"user\" WHERE \"user\".name = '"+ username +"') or gam.loser_id =(SELECT user_id from \"user\" WHERE \"user\".name = '"+ username +"') " +
            "ORDER BY time DESC LIMIT 20";
        return await pool.query(sql);
    },

    getTopTeams: async function getTopTeams(){
        let sql = "Select name,score from team ORDER BY score DESC LIMIT 10";
        return  await pool.query(sql);
    },

    getUsers: async function getUsers() {
        return  await pool.query("SELECT * FROM \"user\"");
    },

    insertUser: async function insertUser(username,password,email) {
        let sql = "INSERT INTO \"user\" (name,password,email,score) VALUES (\'"+ username +"\',\'"+ password +"\',\'"+ email +"\',0)";
        await pool.query(sql);
    },

    getUserScore: async function getUserScore(username) {
        let sql = "SELECT score FROM \"user\" WHERE \"user\".name = '"+ username+"'";
        return (await pool.query(sql)).rows[0].score;
    },
    getTeamScore: async function getTeamSCore(teamname) {
        let sql = "SELECT score FROM team WHERE name = '"+ teamname+"'";
        return (await pool.query(sql)).rows[0].score;
    },

    getUserTeam: async function getUserTeam(username) {
        let sql = "SELECT \"user\".score,team.name FROM \"user\" join team on \"user\".team_id = team.team_id WHERE \"user\".name = '"+ username+"'";
        let res = await  pool.query(sql);
        let check = res.rows[0];
        if(check === undefined){
            return ''
        }
        return res.rows[0].name;
    },

    getUserPosition:
        async function getUserPosition(username){
            let sql = "SELECT name,ROW_NUMBER() over(ORDER BY score DESC) as pos  from \"user\" ORDER BY score";
            let res = (await pool.query(sql)).rows;
            for(let key in res){
                if(res[key].name === username){
                    return res[key].pos;
                }
            }
    },

    getTopTenInTeam:
        async function getTopTenInTeam(username){
        let sql = "SELECT name,score,last_team_change as joined from \"user\" WHERE team_id = (SELECT team_id from team WHERE team_id = (SELECT team_id from \"user\" WHERE name = '"+ username +"')) ORDER BY SCORE DESC LIMIT 10"
        return (await pool.query(sql)).rows;
    },

    getPositionInTeam:
        async function getPositionInTeam(username){
            let sql = "SELECT name,ROW_NUMBER() over(ORDER BY score DESC) as pos from \"user\" WHERE team_id = (SELECT team_id from team WHERE team_id = (SELECT team_id from \"user\" WHERE name = '"+ username +"')) ORDER BY SCORE DESC LIMIT 10"
            let rows = (await pool.query(sql)).rows;
            for(let key in rows){
                if(rows[key].name === username){
                    return rows[key].pos;
                }
            }
        },

    deleteUserTeam:
        async function deleteUserTeam(username){
            let sql = "UPDATE \"user\" SET team_id = null WHERE name = '"+ username +"'";
            await pool.query(sql);
            },

    getTeamExists:
        async function getTeamExists(username){
            let sql = "SELECT name from team WHERE name = '"+ username +"'";
            let res = await  pool.query(sql);
            return (res).rows.length === 0;
        },

    addTeam:
        async function addTeam(team){
            let sql = "INSERT INTO team (name,score) VALUES('"+ team +"',0) RETURNING team_id";
            return await pool.query(sql);
    },

    updateUserTeam:
        async function updateUserTeam(name,id){
            let sql = "UPDATE \"user\" SET team_id =" + id + ", last_team_change = CURRENT_TIMESTAMP WHERE name='"+ name +"'";
            return await pool.query(sql);
    },


    updateAddUserScore:
        async function updateAddUserScore(name){
            let score = await this.getUserScore(name);
            score += 50;
            let sql = "UPDATE \"user\" SET score =" + score + " WHERE name='"+ name +"'";
            await pool.query(sql);
            let team = await this.getUserTeam(name);
            console.log("asdddddddddddddddddddd",team.length);
            if(team.length === 0) return;
            let teamscore = await this.getTeamScore(team);
            teamscore += 50;
            let sql2 = "UPDATE team SET score =" + teamscore + " WHERE name='" + name+"'";
            return await pool.query(sql2);
        },

    updateSubUserScore:
        async function updateSubUserScore(name){
            let score = await this.getUserScore(name);
            score -= 50;
            if(score < 0){
                score = 0;
            }
            let sql = "UPDATE \"user\" SET score =" + score + " WHERE name='"+ name +"'";
            await pool.query(sql);
            let team = await this.getUserTeam(name);
            console.log("asdsadsad", team);
            if(team.length === 0 ) return;
            let teamscore = await this.getTeamScore(team);
            teamscore -= 50;
            if(teamscore < 0){
                teamscore = 0;
            }
            let sql2 = "UPDATE team SET score =" + teamscore + " WHERE name='" + name+"'";
            return await pool.query(sql2);
        },

    addGame:
        async function addGAme(winner,loser){
            let winid = await this.getUserId(winner);
            let loseid =  await this.getUserId(loser);
            let sql = "INSERT INTO game (winner_id,loser_id,score,time) VALUES("+winid+", "+loseid+", 50, CURRENT_TIMESTAMP)";
            console.log(sql);
            return await pool.query(sql);
        },

    getUserId:
        async function getUserId(name){
            let sql = "SELECT user_id as id FROM \"user\" WHERE name = '" +name+"'";
            console.log(sql);
            let res =  await pool.query(sql);
            return res.rows[0].id;
        },

    updateUserTeamByName:
        async function updateUserTeamByName(name,teamname){
            let sql = "UPDATE \"user\" SET team_id = (SELECT team_id from team WHERE name = '"+ teamname+"') WHERE name='"+ name +"'";
            return await pool.query(sql);
        },

    getTeams:
        async function getTeams(){
            let sql = "SELECT name,(SELECT COUNT(*) as number FROM \"user\" WHERE \"user\".team_id = team.team_id) from team ";
            return await pool.query(sql);
        },

    logLogin:
        async function logLogin(username){
            let sql = "INSERT INTO log (user_id,log_type,time) VALUES((SELECT user_id from \"user\" WHERE name = '"+username+"'),1,CURRENT_TIMESTAMP)";
            await pool.query(sql);
        },

    logLogout:
        async function logLogout(username){
            let sql = "INSERT INTO log (user_id,log_type,time) VALUES((SELECT user_id from \"user\" WHERE name = '"+username+"'),2,CURRENT_TIMESTAMP)";
            await pool.query(sql);
        },

    logCreateTeam:
        async function logCreateTeam(id,username){
            let sql = "INSERT INTO log (team_id,user_id,log_type,time) VALUES("+id+",(SELECT user_id from \"user\" WHERE name = '"+username+"'),5,CURRENT_TIMESTAMP)";
            await pool.query(sql);
        },

    logLeaveTeam:
        async function logLeaveTeam(username){
            let sql = "INSERT INTO log (team_id,user_id,log_type,time) VALUES((SELECT team_id from \"user\" WHERE name = '"+ username +"'),(SELECT user_id from \"user\" WHERE name = '"+username+"'),4,CURRENT_TIMESTAMP)";
            console.log(sql);
            await pool.query(sql);
        },

    logJoinTeam:
        async function logJoinTeam(username,team){
            let sql = "INSERT INTO log (team_id,user_id,log_type,time) VALUES((SELECT team_id from team WHERE name = '"+ team +"'),(SELECT user_id from \"user\" WHERE name = '"+username+"'),3,CURRENT_TIMESTAMP)";
            await pool.query(sql);
        },

    getLogs:
        async function getLogs(){
         let sql = "SELECT (SELECT name from team WHERE team_id = log.team_id) as team_name,\n" +
             "\t\t(SELECT name from \"user\" WHERE user_id = log.user_id) as username,\n" +
             "\t\t(SELECT name from log_type WHERE type_id = log.log_type) as type,\n" +
             "\t\ttime\n" +
             "from log\n" +
             "ORDER BY time DESC";
         return await pool.query(sql);
        },

    getAllTeams:
    async function getAllTeams(){
        let sql = "SELECT name from team";
        return (await pool.query(sql)).rows;
    },

    getUsersLog:
        async function getUsersLog(){
            let sql = "SELECT name from \"user\"";
            return (await pool.query(sql)).rows;
        },

    getGames:
        async function getGames(){
            let sql = "SELECT (SELECT name from \"user\" WHERE user_id = game.winner_id) as winner, (SELECT name from \"user\" WHERE user_id = game.loser_id) as loser, score, time from game";
            return (await pool.query(sql)).rows;
        },

    deleteUser:
        async function deleteUser(name){
            let sql = "DELETE FROM \"user\" WHERE name ='"+name+"' RETURNING *";
            return (await pool.query(sql));
        },

    deleteTeam:
        async function deleteTeam(name){
            let sql = "DELETE FROM team WHERE name ='"+name+"' RETURNING *";
            return (await pool.query(sql));
        }
};