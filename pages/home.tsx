import { useSession } from 'next-auth/client';
import Head from 'next/head';

export default function Home() {
  const [session, loading] = useSession();
  if (loading) {
    return <h1>Loading...</h1>;
  }
  return <div>
    <Head>
      <title>Home</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <h1>Home</h1>
    {session &&
      <p>Hello, {session.user.name}!</p>
    }
  </div>;
}