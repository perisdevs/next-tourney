import { ObjectID } from "bson";
import Layout from "../../components/layout";
import TourneyLink from "../../components/tourneylink";
import UserLink from "../../components/userlink";
import { getDBCollection, getDBObject, getTourney, getUserById } from "../../lib/dbops";
import styles from '../../styles/User.module.css';

export async function getServerSideProps({ params }) {    
    let user = JSON.parse(await getUserById(params.id));   

    let tourneys = [];
    for (let i = 0; i < user.tourneys.length; i++) {
        let tourney = JSON.parse(await getTourney(user.tourneys[i]));        
        tourneys.push(tourney);
    }    

    let ownedTourneys = JSON.parse(await getDBCollection({
        owner: new ObjectID(user._id),
    }, {}, 'tournaments'));

    let wonTourneys = [];
    for (let i = 0; i < user.wins.length; i++) {
        let win = JSON.parse(await getDBObject({
            _id: new ObjectID(user.wins[i]),
        }, {
            _id: 1,
            name: 1,
        }, 'tournaments'));
        wonTourneys.push(win);
    }

    let matchHistory = [];
    for (let i = 0; i < user.matchHistory.length; i++) {

        let match = JSON.parse(await getDBObject({
            _id: new ObjectID(user.matchHistory[i]),
        }, {}, 'matches'));

        let tourney = JSON.parse(await getDBObject({
            _id: new ObjectID(match.tourney),
        }, {
            _id: 1,
            name: 1,
        }, 'tournaments'));

        match.tourney = tourney;
        matchHistory.push(match);
    }

    return {
        props: {
            tourneys,
            user,                       
            ownedTourneys,
            wonTourneys,
            matchHistory,
        },
    };
}

export default function User({ user, tourneys, ownedTourneys, wonTourneys, matchHistory }) {    

    return (        
        <Layout>
            <h2>{user.username}</h2>

            <div className={styles.container}>

                <div className={styles.tourneyContainer}>

                    <h2>Tourneys</h2>
                    <div className={styles.tourney}>
                    {tourneys[0] ? ( 
                        <>
                            {tourneys.map(({ name, _id }) => (
                                <>
                                <TourneyLink name={name} _id={_id} />
                                </>
                            ))}
                        </>
                    ) : (
                        <p>no tourneys</p>
                    )}
                    </div>  

                </div>

                <div className={styles.tourneyContainer}>

                    <h2>ownedTourneys</h2>           
                    <div className={styles.tourney}>
                    {(ownedTourneys[0]) ? (
                        <>
                        {ownedTourneys.map(({ name, _id }) => (
                            <>
                            <TourneyLink name={name} _id={_id} />
                            </>
                        ))}
                    </>
                    ) : (
                        <p>no owned tourneys</p>
                    )}
                    </div>

                </div>
                
                <div className={styles.tourneyContainer}>

                    <h2>Wins</h2>
                    <div className={styles.tourney}>
                    {(wonTourneys[0]) ? (
                        <>
                        {wonTourneys.map(({ name, _id }) => (
                            <>
                            <TourneyLink name={name} _id={_id} />
                            </>
                        ))}
                        </>
                    ) : (
                        <>No wins :(((</>
                    )}
                    </div>

                </div>

            </div>

            <div className={styles.container}>

                <div className={styles.matchHistory}>

                    {(matchHistory[0]) ? (
                        <>
                        {matchHistory.map(({winner, loser, tourney}) => (
                            <div className={styles.match}>
                                <div className={`${styles.win} ${styles.player}`}>
                                    W:&nbsp;<UserLink username={winner.username} _id={winner._id} />
                                </div>
                                <div className={`${styles.loss} ${styles.player}`}>
                                    L:&nbsp;<UserLink username={loser.username} _id={loser._id} />
                                </div>
                                <div className={styles.tourneyLink}>
                                    <TourneyLink name={tourney.name} _id={tourney._id} />
                                </div>
                            </div>
                        ))}
                        </>
                    ) : (
                        <>no matches</>
                    )}

                </div>

            </div> 
            
        </Layout>
    );
}