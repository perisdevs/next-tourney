import { ObjectID } from "bson";
import { createNewDBObject, updateDBObject } from "../../lib/dbops";

export default async function handler(req, res) {
    let bracket = req.body.bracket;
    let match = req.body.match;
    match.tourney = bracket.tourney;
    
    let bracketResult = null;    

    if (bracket.winner) {
        let result0 = await updateDBObject({
            _id: new ObjectID(bracket._id),
        }, {            
            $set: {
                winner: bracket.winner,
                rounds: bracket.rounds
            },
        }, 'brackets');

        let result1 = await updateDBObject({
            _id: new ObjectID(bracket.winner._id),
        }, {
            $push: {
                wins: new ObjectID(bracket.tourney),
            }
        }, 'users');

        bracketResult = {
            result0: result0,
            result1: result1,
        };

    } else {
        bracketResult = await updateDBObject({
            _id: new ObjectID(bracket._id),
        }, {
            $set: {rounds: bracket.rounds},
        }, 'brackets'); 
    }

    let matchResult0 = JSON.parse(await createNewDBObject(match, 'matches'));

    let matchResult1 = await updateDBObject({
        _id: new ObjectID(match.winner._id),
    }, {
        $push: {
            matchHistory: matchResult0.insertedId,
        }
    }, 'users');

    let matchResult2 = await updateDBObject({
        _id: new ObjectID(match.loser._id),
    }, {
        $push: {
            matchHistory: matchResult0.insertedId,
        }
    }, 'users');

    let matchResult = {
        matchResult0: matchResult0,
        matchResult1: matchResult1,
        matchResult2: matchResult2,
    };

    let result = {
        bracketResult: bracketResult,
        matchResult: matchResult,
    };

    res.status(200).json(result);
}