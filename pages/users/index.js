import Layout from '../../components/layout';
import UserLink from '../../components/userlink';
import { getUsers } from '../../lib/dbops';

import styles from '../../styles/Users.module.css';

export async function getServerSideProps() {
  let users = JSON.parse(await getUsers());
  return {
    props: {
      users,
    },
  };
}

export default function Users({ users }) {
  return (
    <Layout>    
      <div className={styles.users}>
        {users.map(({ username, _id }) => (   
          <div className={styles.user}>
            <UserLink username={username} _id={_id} />
          </div>
        ))} 
      </div><br />                                   
    </Layout>
  );
}
