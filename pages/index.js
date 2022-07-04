import Link from 'next/link';
import Layout from '../components/layout';
import GameLink from '../components/gamelink';
import Form from '../components/form';
import { getGamesLimit } from '../lib/dbops';

import styles from '../styles/Home.module.css';

export async function getServerSideProps() {
  let games = JSON.parse(await getGamesLimit(6));
  return {
    props: {      
      games,
    },
  };
}

export default function Home({ games, }) {

  return (
    <Layout>        
      <div className={styles.gamesContainer}>
        {games.map(({ name, id }) => (      
            <GameLink name={name} />                                                  
        ))} 
      </div><br />                                   
    </Layout>
  );
}
