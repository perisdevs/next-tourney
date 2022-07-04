import { useRouter } from 'next/router';
import Layout from '../components/layout';
import styles from '../styles/Login.module.css';

export async function getServerSideProps() {  
  return {
    props: {
      
    },
  };
}

export default function Login({  }) {
    const router = useRouter();    
    const handleSubmit = async function(event) {                
        event.preventDefault();
        let username = event.target.username.value;
        let password = event.target.password.value;
        let data = {
            username: username,
            password: password
        };
        let jsonData = JSON.stringify(data);
        let url = '/api/verify';
        let options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: jsonData,
        };
        let response = await fetch(url, options);
        let result = await response.json();
        let obj = JSON.parse(result);
        let verified = obj.verified;
        if(verified) {
            console.log(JSON.stringify(obj.user));
            let user = JSON.stringify(obj.user);
            sessionStorage.setItem('user', user);
            console.log(sessionStorage.getItem('user'));
            router.push('/');
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
                <button type='submit'>Login</button>
            </div>      
        </form>        
    </Layout>
    );
}
