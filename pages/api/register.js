import { createNewDBObject, createNewUser, getUserByUsername, updateDBCollection } from "../../lib/dbops";

export default async function handler(req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let passwordConf = req.body.passwordConf;
    
    let passwordsMatch = (password == passwordConf);    

    let user = await getUserByUsername(username);   
    let usernamesMatch = (user != 'null');   
    
    let userCreated = false;
    if (!usernamesMatch && passwordsMatch) {
        let createdUser = JSON.parse(await createNewDBObject({
            username: username,
            password: password,
            tourneys: [],
            wins: [],
            matchHistory: [],
        }, 'users'));
        userCreated = createdUser.acknowledged;        
    }

    let result = {
        passwordsMatch: passwordsMatch,
        usernamesMatch: usernamesMatch,
        userCreated: userCreated,
    };       

    res.status(200).json(result);
}