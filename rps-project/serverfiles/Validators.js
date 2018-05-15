let database = require('./DBQueries');
let crypto = require('crypto');


function isEmpty(array){
    if(Object.keys(array).length) return true;
    return false;
}

module.exports = {
    validateLoginInput:
        async function validateLoginInput(data) {
            let errors = {};

            if (isEmpty(data.username)) {
                errors.username = 'This field is required!';
            }
            if (isEmpty(data.password)) {
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
       },

    validateRegsterInput:
        async function validateRegsterInput(data) {
            let errors = {};
            let users = await database.getUsers();
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
                await database.insertUser(data.username,crypto.createHash('md5').update(data.password).digest("hex"),data.email);
            }
            return {errors,
                isValid: isEmpty(errors)
            }
        }
};


    async function checkIfUserIsRegistredAndPasswordIsCorrect(username,password) {
        let users  = await database.getUsers();
        users = users.rows;
        let correctname;

        for(let key in users){
            if(users[key].name === username){
                correctname = true;
                if(users[key].password === crypto.createHash('md5').update(password).digest("hex")){
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
            if(users[key].name === username){
                matchname = true;
            }
            if(users[key].email === email){
                matchmail = true;
            }
        }
        if(matchname && matchmail) return 0;
        if(matchname) return 1;
        if(matchmail) return 2;
        return true;
    }
