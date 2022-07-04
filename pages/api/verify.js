import { verifyUser } from "../../lib/dbops";

export default async function handler(req, res) {

    if ( !req.body.username || !req.body.password ) {
        res.status(400).json({ data: 'aaa' });
    } else {

        let user = await verifyUser(req.body.username, req.body.password);        
        res.status(200).json(user);
    }
    
}