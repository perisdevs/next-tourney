import Link from 'next/link';
import Layout from '../../components/layout';
import styles from '../../styles/Home.module.css';
import { getTourneys } from '../../lib/dbops';
import TourneyLink from '../../components/tourneylink';
import { useState, useEffect } from 'react';

export async function getServerSideProps() {
  let tourneys = JSON.parse(await getTourneys());
  return {
    props: {
      tourneys,
    },
  };
}

export default function Tourneys({ tourneys }) {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('user')) {
      setLoggedIn(true);
    }
  }, []);
  
  return (
    <Layout>   
      { loggedIn ? (
        <>
          <Link href='/tourneys/create'>
            <a>Create New Tourney</a>
          </Link>
        </>
      ) : (<></>)}   
      
      <div className={styles.gamesContainer}>
        {tourneys.map(({ name, _id }) => (      
            <TourneyLink name={name} _id={_id} />                                                  
        ))} 
      </div><br />
                                     
    </Layout>
  );
}
