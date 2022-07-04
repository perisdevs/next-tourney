import Layout from '../components/layout';
import styles from '../styles/Login.module.css';
import { useState } from 'react';

export async function getServerSideProps() {  
  return {
    props: {
      
    },
  };
}

export default function Register({  }) {
    const [error, setError] = useState(null);    

    const handleSubmit = async function(e) {
        e.preventDefault();
        
        let data = {
            username: e.target.username.value,
            password: e.target.password.value,
            passwordConf: e.target.passwordConf.value,
        };

        let url = '/api/register';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };
        let response = await fetch(url, options);
        let result = await response.json(); 
        console.log(result)             ;
        
        if (!result.passwordsMatch) {
            setError(`Passwords don't match`); 
        } else if (result.usernamesMatch) {
            setError(`User ${e.target.username.value} already exists`);
        } else if (result.userCreated) {
            setError(`User ${e.target.username.value} created`);
        } 
        
               
    }

    return (
    <Layout>        
        <form onSubmit={handleSubmit}>
            <div className={styles.loginForm}>
                <label htmlFor='username'>Username:</label>
                <input type='text' id='username' name='username' required />
                <label htmlFor='password'>Password:</label>
                <input type='text' id='password' name='password' required />
                <label htmlFor='passwordConf'>Confirm:</label>
                <input type='text' id='passwordConf' name='passwordConf' required />
                <button type='submit'>Register</button>                                
            </div>                           
            <p>{error}</p>
        </form>        
    </Layout>
    );
}
