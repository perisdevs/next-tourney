import Layout from '../../components/layout';
import GameLink from '../../components/gamelink';
import { getDBCollection } from '../../lib/dbops';

import styles from '../../styles/Home.module.css';

export async function getServerSideProps() {
  //let games = JSON.parse(await getGames());

  let games = JSON.parse(await getDBCollection({},{},'games'));

  return {
    props: {
      games,
    },
  };
}

export default function Home({ games }) {
  return (
    <Layout>    
      <div className={styles.gamesContainer}>
        {games.map(({ name, id }) => (      
            <GameLink name={name} />                                                  
        ))} 
      </div>                 
    </Layout>
  );
}
