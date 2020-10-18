import Head from 'next/head'
import styles from '../styles/Home.module.css';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Index() {
  const [session, loading] = useSession();
  return (
    <div>
      <Head>
        <title>Ken Next demo</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Welcome to Ken's demo web app.</h1>
      {!session &&
        <a className={styles.btn} onClick={() => signIn('github')}>Sign in</a>
      }
      {session &&
        <>
          <p>Signed in as <em>{session.user.name}</em>.</p>
          <a className={styles.btn} onClick={() => signOut()}>Sign out</a>
        </>
      }
    </div>
  );
}
