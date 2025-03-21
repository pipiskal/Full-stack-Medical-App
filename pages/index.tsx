import Link from 'next/link';

import Layout from '@/components/Layout/Layout';

const Home = () => {
  return (
    <div
      style={{
        fontSize: '1.5rem',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '200px',
      }}
    >
      <Link href="/auth/login">Login</Link>
    </div>
  );
};

Home.getLayout = () => (
  <Layout type="home">
    <Home />
  </Layout>
);

export default Home;
