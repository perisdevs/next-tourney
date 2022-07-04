import UserLink from "./userlink";
import styles from '../styles/Player.module.css';

export default function Player({ player }) {

    let playerStyle = styles.player;    

    return (
        <>
            {(player) ? (
                <div className={playerStyle}>
                    <UserLink username={player.username} _id={player._id} />
                </div>
            ) : (
                <div className={styles.nullPlayer}>
                    <></>
                </div>
            )}
        </>
    )
}