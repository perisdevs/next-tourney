import Link from 'next/link';
import styles from '../styles/GameLink.module.css';

export default function TourneyLink({ name, _id }) {
    return (
        <div className={styles.body}>
            <Link href={`/tourneys/${_id}`}>
                <a>
                    {name}
                </a>
            </Link>
        </div>
    );
}