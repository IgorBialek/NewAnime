import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

import Home from '../components/content/Home';

const HomePage = () => {
  return <Home />;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: true,
      },
    };
  }

  return {
    props: {},
  };
};

export default HomePage;
