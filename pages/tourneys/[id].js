import Layout from "../../components/layout";
import { getDBCollection, getDBObject, getUserById } from "../../lib/dbops";
import styles from '../../styles/TourneyPage.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/router";
import UserLink from "../../components/userlink";
import Bracket from "../../components/bracket";


const ObjectID = require('mongodb').ObjectId;

export async function getServerSideProps({ params }) {    

    let tourney = JSON.parse(await getDBObject({
        _id: new ObjectID(params.id)
    }, {}, 'tournaments'));    

    let game = JSON.parse(await getDBObject({
        _id: new ObjectID(tourney._gameid),
    }, {}, 'games'));      

    let owner = JSON.parse(await getDBObject({
        _id: new ObjectID(tourney.owner),
    }, {}, 'users'));

    let players = [];
    for (let i = 0; i < tourney.players.length; i++) {        
        let player = JSON.parse(await getUserById(tourney.players[i]));
        players.push(player);
    }
    
    let bracket = JSON.parse(await getDBObject({
        tourney: new ObjectID(tourney._id),
    }, {}, 'brackets'));

    let matchHistory = JSON.parse(await getDBCollection({
        tourney: tourney._id,
    }, {}, 'matches'));
       
    return {
        props: {
            tourney,            
            game,  
            players, 
            owner,  
            bracket,   
            matchHistory,    
        },
    };
}

export default function Tourney({ tourney, game, players, owner, bracket, matchHistory }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            setUser(JSON.parse(sessionStorage.getItem('user')));
        }
    }, []);

    const signUpUser = async function(event) {
        event.preventDefault();        
        let data = {
            user: user,
            tourney: tourney,
        };
        let jsonData = JSON.stringify(data);
        let url = '/api/signup';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        };
        let response = await fetch(url, options);
        let result = await response.json();        
        router.push(router.asPath);
    };    
    
    const createBracket = async function(event) {
        event.preventDefault();        
        let data = {
            tourney: tourney,
        };
        let jsonData = JSON.stringify(data);
        let url = '/api/createnewbracket';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        };
        let response = await fetch(url, options);
        let result = await response.json();        
        router.push(router.asPath);
    }    

    let isOwner = false;

    if (user) {
        isOwner = (user._id == tourney.owner);                    
    }

    return (        
        <Layout>            
            <div className={styles.main}>
                <div className={styles.tourneyInfo}>
                    <h3>{tourney.name} - {owner.username}</h3>
                    {(tourney.players.length == tourney.bracketSize) ? (
                        <>
                        {(isOwner) ? (
                            <button onClick={createBracket}>Make Bracket</button>                            
                        ) : (
                            <button onClick={createBracket} disabled>Make Bracket</button>
                        )}                            
                        </>
                    ) : (
                        <button onClick={createBracket} disabled>Make Bracket</button>
                    )}                    
                    <>&nbsp;-&nbsp;{tourney.players.length}
                    &nbsp;/&nbsp;{tourney.bracketSize}&nbsp;Players<br /></>
                    
                    {(user) ? (                
                        <button onClick={signUpUser}>Sign Up</button>                
                        ) : (
                        <button onClick={signUpUser} disabled>Sign Up</button>
                    )}
                </div>  

                <div className={styles.playerInfo}>
                    <h2>Players</h2>                             
                    <div className={styles.players}>                                
                        {players[0] ? (
                            <>
                                {players.map(({ username, _id }) => (    
                                    <div className={styles.player}>    
                                        <UserLink username={username} _id={_id} />                       
                                    </div>
                                ))} 
                            </>                  
                        ) : (
                            <p>no players</p>
                        )}
                    </div>
                </div>
            </div>                        
            
            {(bracket) ? (
                <Bracket bracket={bracket} />
            ) : (<></>)}  

            {(matchHistory) ? (
                <>
                <h2>Match History</h2>
                <div className={styles.matchHistory}>
                {matchHistory.map(({winner, loser, tourney}) => (
                    <div className={styles.match}>
                        <div className={`${styles.win} ${styles.hPlayer}`}>
                            W:&nbsp;<UserLink username={winner.username} _id={winner._id} />
                        </div>
                        <div className={`${styles.loss} ${styles.hPlayer}`}>
                            L:&nbsp;<UserLink username={loser.username} _id={loser._id} />
                        </div>                        
                    </div>
                ))}
                </div>
                </>
            ) : (
                <>no matches</>
            )}
        </Layout>
    );
}