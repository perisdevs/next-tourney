import Match from "./match";
import styles from '../styles/Bracket.module.css';
import { useState } from 'react';
import Router from "next/router";

export default function Bracket({ bracket }) {

    const [b, setBracket] = useState(bracket);

    const updateBracket = async function(newBracket, match) {        
        let data = {                        
            bracket: newBracket,
            match: match,
        };
        let jsonData = JSON.stringify(data);
        let url = '/api/updatebracket';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        };
        let response = await fetch(url, options);
        let result = await response.json();        
        
    };
    
    const setWinner = (match, player) => {  
        let updatedBracket = structuredClone(b); //Copy bracket state and set winner
        updatedBracket.rounds[match.round][match.matchid].winner = player;        

        let winner = player;
        let loser = null;

        if (updatedBracket.rounds[match.round][match.matchid].player1._id == winner._id) { //compare user ids to
            loser = updatedBracket.rounds[match.round][match.matchid].player2;             //determine loser
        } else {
            loser = updatedBracket.rounds[match.round][match.matchid].player1;
        }

        let newMatch = { //create match obj for db
            winner: winner,
            loser: loser,
            tourney: updateBracket.tourney,
        };

        if (updatedBracket.rounds[match.round+1]) { //If there is a next round, progress player
            
            if (!updatedBracket.rounds[match.round+1][match.nextMatch].player1) {
                updatedBracket.rounds[match.round+1][match.nextMatch].player1 = player;

            } else {
                updatedBracket.rounds[match.round+1][match.nextMatch].player2 = player;

            }
        } else { //If no next round, set winner of bracket
            updatedBracket.winner = player;
        }
        setBracket(updatedBracket); //Replace bracket state with updated bracket
        updateBracket(updatedBracket, newMatch); //Send bracket and match to be comitted to db
    }
    
    return(
    <>
        <div>
        {(b.winner) ? (
            <h2>WINNER {b.winner.username}</h2>
        ) : (<></>)} 
        </div>

        <div className={styles.rounds}>          
            {b.rounds.map((e) => (            
                <div className={styles.matches}>
                    {e.map((e1) => (                      
                        <div className={styles.match}>                            
                            <Match match={e1} 
                            p1win={() => setWinner(e1, e1.player1)} 
                            p2win={() => setWinner(e1, e1.player2)}/>                                                                
                        </div>
                    ))}                     
                </div>            
            ))}                     
        </div> 
    </>               
    );
}