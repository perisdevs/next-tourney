import Image from 'next/image';
import Layout from "../../components/layout";
import TourneyLink from '../../components/tourneylink';
import { getGame, getTourneysByGameId } from "../../lib/dbops";
import styles from '../../styles/GamePage.module.css';

export async function getServerSideProps({ params }) {
    let game = JSON.parse(await getGame(params.name));
    let tourneys = JSON.parse(await getTourneysByGameId(game._id));    
    return {
        props: {
            game,            
            tourneys,
        },
    };
}

export default function Game({ game, tourneys }) {
    return (
        <Layout>
            <Image priority
            src={`/images/${game.name}.png`}
            height={70}
            width={200}
            alt={game.name}
            />
            
            <h2>Available Tourneys</h2>                        
            <div className={styles.tourneys}>
                {tourneys ? (
                <>
                    {tourneys.map(({ name, _id }) => (                        
                        <>
                            <TourneyLink name={name} _id={_id} />                                                                            
                        </>
                    ))}
                </>
                ) : (
                <p>no</p>)}
            </div>                       
        </Layout>
    );
}