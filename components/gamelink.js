import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/GameLink.module.css';

export default function GameLink({ name }) {
    return (
        <div className={styles.body}>
            <Link href={`/games/${name}`}>
                <a><Image
                    priority
                    src={`/images/${name}.png`}
                    height={70}
                    width={200}
                    alt={name}
                    />
                </a>
            </Link>
        </div>
    );
}