import UserLink from "./userlink";
import { useState } from 'react';
import styles from '../styles/Match.module.css';
import Player from "./player";

export default function Match({ match, p1win, p2win }) {
    
    const [p1Style, setP1] = useState(styles.player);
    const [p2Style, setP2] = useState(styles.player);

    const setP1Winner = function() {
        setP1(`${styles.winner} ${styles.player}`);
        setP2(`${styles.loser} ${styles.player}`);
        match.winner = match.player1;
        p1win();
    };

    const setP2Winner = function() {
        setP2(`${styles.winner} ${styles.player}`);
        setP1(`${styles.loser} ${styles.player}`);
        match.winner = match.player2;
        p2win();
    };

    return(        
        <>
        {(match.winner) ? (
            <div className={styles.match}> 
                {(match.winner._id == match.player1._id) ? (
                    <div className={`${styles.player} ${styles.winner}`}>
                        <Player player={match.player1} />                
                        <span>　</span> 
                    </div>
                ) : (
                    <div className={`${styles.player} ${styles.loser}`}>
                        <Player player={match.player1} />                
                        <span>　</span> 
                    </div>
                )}

                {(match.winner._id == match.player2._id) ? (
                    <div className={`${styles.player} ${styles.winner}`}>
                        <Player player={match.player2} />                
                        <span>　</span> 
                    </div>
                ) : (
                    <div className={`${styles.player} ${styles.loser}`}>
                        <Player player={match.player2} />                
                        <span>　</span> 
                    </div>
                )}
            </div>
        ) : (
            <div className={styles.match}>            
                <div className={p1Style}>                                
                    <Player player={match.player1} />                
                    {(match.winner || (!match.player1 || !match.player2 )) ? (
                        
                        <span>　</span>
                    ) : (
                        <span onClick={setP1Winner}>Ｗ</span>
                    )}                
                </div>

                <div className={p2Style}>                
                    <Player player={match.player2} />
                    {(match.winner || (!match.player1 || !match.player2 )) ? (
                        <span>　</span>
                    ) : (
                        <span onClick={setP2Winner}>Ｗ</span>
                    )}                                
                </div>
            </div> 
        )}    
        </>              
    );
}