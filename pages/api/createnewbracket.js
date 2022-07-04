import { ObjectID } from "bson";
import { BracketData } from "../../lib/brackets";
import { createNewDBObject, getDBObject, updateDBObject } from "../../lib/dbops";


export default async function handler(req, res) {

    let tourney = req.body.tourney;    

    let checkTourney = JSON.parse(await getDBObject({
        tourney: new ObjectID(tourney._id),
    }, {}, 'brackets'));
    
    if (!checkTourney) {
        let newBracket = await BracketData.build(tourney.bracketSize, tourney.players, tourney._id);
        let result = await createNewDBObject(newBracket, 'brackets'); //updates indie bracket            
        res.status(200).json(result);
    } else {
        res.status(200).json(null);
    }
    
}