import { ObjectID } from "bson";
import { getDBObject } from "./dbops";

class Player {
    constructor(user) {
        this.username = user.username;
        this._id = new ObjectID(user._id);        
    }

    static async build(_id) {
        let user = JSON.parse(await getDBObject({
            _id: new ObjectID(_id),
        }, {
            _id: 1,
            username: 1,
        }, 'users'));

        return new Player(user);
    }
}

class Match {
    constructor(player1, player2) {                       
        this.winner = null;
        this.nextMatch = null;   
        this.round = null;   
        this.matchid = null;
        this.player1 = player1;
        this.player2 = player2;  
    }

    static async build(player1, player2) {
        let newP1, newP2 = null;
        if (player1) {
            newP1 = await Player.build(player1);    
        } else newP1 = null;

        if(player2) {
            newP2 = await Player.build(player1);
        } else newP2 = null; 

        return new Match(newP1, newP2);
    }
}

export class BracketData {
    constructor(bracketSize, players, rounds, tourney) {        
        this.bracketSize = bracketSize;
        this.players = [];
        players.forEach((e) => {            
            let newPlayer = new ObjectID(e);
            this.players.push(newPlayer);
        });
        this.winner = null;
        this.rounds = rounds;
        this.tourney = new ObjectID(tourney);
    }  
    
    static async build(bracketSize, players, tourney) {
        let rounds = [];
        let roundid = 0;
        for (let i = bracketSize / 2; i >= 1; i /= 2) { //no. of matches per round
            let matches = [];
            for (let i1 = 0; i1 < i; i1++) { //create empty matches to fill rounds
                let match = await Match.build(null, null);
                match.nextMatch = Math.floor(i1 / 2); //index of next match equals
                match.round = roundid;                //index divided by 2 round down
                match.matchid = i1;
                matches.push(match);
            }
            rounds.push(matches);
            roundid++;
        }                

        for (let i = 0; i < players.length; i++) { //for each player
            for (let i1 = 0; i1 < rounds[0].length; i1++) { //for each match in r1
                let playerPlaced = false;
                                        
                if (!rounds[0][i1].player1) { //check each match in the round for players, and
                     rounds[0][i1].player1 = await Player.build(players[i]); //assign to empty slot
                     playerPlaced = true;
                } else if (!rounds[0][i1].player2) {
                     rounds[0][i1].player2 = await Player.build(players[i]);
                     playerPlaced = true;
                }

                if (playerPlaced) break;
            }
        }

        return new BracketData(bracketSize, players, rounds, tourney);
    }
}