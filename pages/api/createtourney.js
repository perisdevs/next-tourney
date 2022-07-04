import { createNewTourney } from "../../lib/dbops";

export default async function handler(req, res) {
    let name = req.body.name;
    let _gameid = req.body._gameid;
    console.log(req.body.gameid)
    let bracketSize = parseInt(req.body.bracketSize);
    let owner = req.body.owner;

    let result = await createNewTourney(name, _gameid, bracketSize, owner);    

    res.status(200).json(result);
}