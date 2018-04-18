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
        let sql = "SELECT \"user\".name,\"user\".score, team.name as team_name from \"user\" left join team on team.team_id = \"user\".team_id ORDER BY \"user\".score DESC";
        return await pool.query(sql);
    },


    getLastMatches: async function getLastMatches(username){
        let sql = "SELECT wu.name as winner, lu.name as loser, gam.score as score, time from game as gam join \"user\" as wu on winner_id = wu.user_id join \"user\" as lu on loser_id = lu.user_id "+
            "WHERE gam.winner_id = (SELECT user_id from \"user\" WHERE \"user\".name = '"+ username +"') or gam.loser_id =(SELECT user_id from \"user\" WHERE \"user\".name = '"+ username +"') " +
            "ORDER BY time DESC LIMIT 10";
        return await pool.query(sql);
    },

    getTopTeams: async function getTopTeams(){
        let sql = "Select name,score from team ORDER BY score LIMIT 10";
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

    getUserTeam: async function getUserTeam(username) {
        let sql = "SELECT \"user\".score,team.name FROM \"user\" join team on \"user\".team_id = team.team_id WHERE \"user\".name = '"+ username+"'";
        let res = await  pool.query(sql);
        let check = res.rows[0];
        if(check === undefined){
            return ''
        }
        return res.rows[0].name;
    }
};