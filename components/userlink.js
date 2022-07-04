import Link from 'next/link';
import styles from '../styles/GameLink.module.css';

export default function UserLink({ username, _id }) {
    return (
        
            <Link href={`/users/${_id}`}>
                <a>
                    {username}
                </a>
            </Link>
        
    );
}