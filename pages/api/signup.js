import { testingAddUserToTourney } from "../../lib/dbops";


export default async function handler(req, res) {
    let user = req.body.user;
    let tourney = req.body.tourney;    
    let result = await testingAddUserToTourney(user._id, tourney._id);
    res.status(200).json(result);
}