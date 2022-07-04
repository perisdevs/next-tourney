import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Router from 'next/router';
import styles from '../styles/Layout.module.css';
import UserLink from './userlink';

export default function Layout({ children }) {    
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            setUser(JSON.parse(sessionStorage.getItem('user')));            
        } else {
            setUser(null);
        }
    }, []);

    const logout = function() {
        sessionStorage.removeItem('user');
        Router.reload();
    }

    return (        
        <div className='container'>
            <Head>
                <link rel="icon" href="/favicon.ico" />                                  
                <title>titlee</title>                
            </Head>
            <header className={styles.header}>
                <div className={styles.headerTop}>
                    <div className={styles.logo}>
                        <Link href='/'>
                            <a><Image
                                priority
                                src='/images/logo.png'
                                height={70}
                                width={200}
                                alt='CMacs'
                                />
                            </a>
                        </Link>
                    </div>
                    <div className={styles.user}>
                        {user ? (
                            <>
                            <UserLink username={user.username} _id={user._id} />
                            <a onClick={logout}>Logout</a>
                            </>
                        ) : (
                            <>
                            <Link href='/login'>
                                <a>Login</a>
                            </Link>                            
                            <Link href='/register'>
                                <a>Register</a>
                            </Link>
                            </>
                        )}
                    </div>
                </div>                                                
                <div className={styles.navbar}>
                    <Link href='/games'>
                        <a>Games</a>
                    </Link>
                    <Link href='/tourneys'>
                        <a>Tournaments</a>
                    </Link>
                    <Link href='/users'>
                        <a>Users</a>
                    </Link>
                </div>                                
            </header>
            <main className={styles.body}>                
                {children}                
            </main>
            <footer className={styles.footer}>
                Footerr
            </footer>
        </div>
    );
}