import Head from 'next/head'
import { signIn, signOut, useSession } from 'next-auth/client';
import Button from '../components/button';

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
        <Button label="Sign in" onClick={() => signIn('github', { callbackUrl: 'http://localhost:3000/home' })} />
      }
      {session &&
        <>
          <p>Signed in as <em>{session.user.name}</em>.</p>
          <Button label="Sign out" onClick={() => signOut()} />
        </>
      }
    </div>
  );
}
