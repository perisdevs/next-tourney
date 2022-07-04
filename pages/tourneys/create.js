import Layout from '../../components/layout';
import styles from '../../styles/Forms.module.css';
import { getGames } from '../../lib/dbops';
import { useState, useEffect } from 'react';

export async function getServerSideProps() {
  let games = JSON.parse(await getGames());    
  return {
    props: {
      games,
    },
  };
}

export default function CreateTourney({ games }) {

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            setUser(JSON.parse(sessionStorage.getItem('user')));
        }
    }, []);

    const handleSubmit = async function(e) {
        e.preventDefault();     

        let data = {
            name: e.target.name.value,
            _gameid: e.target.game.value,
            bracketSize: e.target.bracket.value,
            owner: e.target.owner.value,
        };

        let url = '/api/createtourney';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        let response = await fetch(url, options);
        let result = await response.json();        
    }

    return (
    <Layout>
        <>
        {(user) ? (
            <form onSubmit={handleSubmit}>
            <div className={styles.createTourney}>
                <label htmlFor='name'>Name:</label>
                <input type='text' id='name' name='name' required />
                <label htmlFor='game'>Game:</label>
                <select name='game' id='game'>
                    {games.map(({ name, _id }) => (
                        <option value={_id}>{name}</option>
                    ))}
                </select>
                <label htmlFor='bracket'>Bracket Size:</label>
                <input type='number' id='bracket' name='bracket' />
                <input type='hidden' id='owner' name='owner' value={user._id} />                
                <button type='submit'>Create Tourney</button>
            </div>  
        </form> 
        ) : (
            <h1>You must be logged in</h1>
        )}
        </>         
                                
    </Layout>
    );
}
