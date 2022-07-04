const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectId;
const url = 'mongodb://localhost:27017/tourneys';

async function loadDB() {
    const client = await MongoClient.connect(url);
    let db = client.db('tourneys');
    return db;
}

export async function getGames() {
    let result;
    let db = await loadDB();    
    result = await db.collection('games').find({}).toArray();
    return JSON.stringify(result);
}

export async function getGamesLimit(limit) {
    let result;
    let db = await loadDB();
    result = await db.collection('games').find({}).limit(limit).toArray();
    return JSON.stringify(result);
}

export async function getGame(name) {
    let db = await loadDB();
    let q = { name: name };    
    let result = await db.collection('games').findOne(q);
    return JSON.stringify(result);
}

export async function getTourney(id) {
    let db = await loadDB();
    let q = { _id: new ObjectID(id) };    
    let result = await db.collection('tournaments').findOne(q);
    return JSON.stringify(result);
}

export async function getTourneys() {
    let db = await loadDB();
    let result = await db.collection('tournaments').find().toArray();
    return JSON.stringify(result);
}

export async function getGameFromTourney(tourney) {
    let db = await loadDB();
    let q = { _id: new ObjectID(tourney._gameid) };
    let result = await db.collection('games').findOne(q);
    return JSON.stringify(result);
}

export async function getGameById(id) {
    let db = await loadDB();
    let q = { _id: new ObjectID(id) };
    let result = await db.collection('games').findOne(q);
    return JSON.stringify(result);
}

export async function getTourneysByGameId(id) {
    let db = await loadDB();
    let q = { _gameid: new ObjectID(id) };
    let result = await db.collection('tournaments').find(q).toArray();
    return JSON.stringify(result);
}

export async function verifyUser(username, password) {
    let db = await loadDB();
    let q = { username: username, password: password };
    let opt = { projection: { password: 0 } };
    let user = await db.collection('users').findOne(q, opt);
    let result;
    if (user) {
        result = { 
            verified: true,
            user: user,
        };        
    } else if(!user) {
        result = { verified: false };
    }    
    return JSON.stringify(result);
}

export async function testingAddUserToTourney(_userid, _tourneyid) {    
    let db = await loadDB();
    let tourneyQuery = { _id: new ObjectID(_tourneyid) };
    let tourney = await db.collection('tournaments').findOne(tourneyQuery);
    let result;       
    if (!tourney.players.some(e => e == _userid) && tourney.players.length < tourney.bracketSize) {
        let userUpdate = { $push: { tourneys: new ObjectID(_tourneyid)} };    
        let tourneyUpdate = { $push: { players: new ObjectID (_userid)} };
        let userQuery = { _id: new ObjectID(_userid) };
        let userResult = await db.collection('users').updateOne(userQuery, userUpdate);
        let tourneyResult = await db.collection('tournaments').updateOne(tourneyQuery, tourneyUpdate);
        result = {
            userResult: userResult,
            tourneyResult: tourneyResult,
        };
    } else {
        result = {
            userResult: null,
            tourneyResult: null,
        };
    }
    return JSON.stringify(result);
}

export async function getUsers() {
    let db = await loadDB();
    let result = await db.collection('users').find().toArray();
    return JSON.stringify(result);
}

export async function getUserById(id) {
    let db = await loadDB();    
    let q = { _id: new ObjectID(id) };
    let result = await db.collection('users').findOne(q);
    return JSON.stringify(result);
}

export async function getUserByUsername(username) {
    let db = await loadDB();
    let q = { username: username };
    let result = await db.collection('users').findOne(q);
    return JSON.stringify(result);
}

export async function createNewUser(username, password) {
    let db = await loadDB();
    let obj = {
        username: username,
        password: password,
        tourneys: [],
    };
    let result = await db.collection('users').insertOne(obj);
    return JSON.stringify(result);
}

export async function createNewTourney(name, _gameid, bracketSize, owner) {
    let db = await loadDB();    
    let obj = {
        name: name,
        _gameid: new ObjectID(_gameid),
        players: [],
        bracketSize: bracketSize,
        owner: new ObjectID(owner),
    };
    let result = await db.collection('tournaments').insertOne(obj);
    return JSON.stringify(result);
}

export async function getDBObject(query, projection, collection) {
    let db = await loadDB();
    let q = query;
    let opt = { projection: projection };
    let obj = await db.collection(collection).findOne(q, opt);
    return JSON.stringify(obj);
}

export async function getDBCollection(query, projection, collection) {
    let db = await loadDB();
    let q = query;
    let opt = { projection: projection };
    let obj = await db.collection(collection).find(q, opt).toArray();
    return JSON.stringify(obj);
}

export async function updateDBObject(query, update, collection) {
    let db = await loadDB();
    let obj = await db.collection(collection).updateOne(query, update);
    return JSON.stringify(obj);
}

export async function updateDBCollection(query, update, collection) {
    let db = await loadDB();
    let obj = await db.collection(collection).updateMany(query, update);
    return JSON.stringify(obj);
}

export async function createNewDBObject(obj, collection) {
    let db = await loadDB();        
    let result = await db.collection(collection).insertOne(obj);
    return JSON.stringify(result);
}