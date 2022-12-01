import '@fontsource/rubik';
import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import { RecoilRoot } from 'recoil';

import SnapshotProvider from '../components/firebase/SnapshotProvider';

import type { AppProps } from "next/app";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SessionProvider session={pageProps.session}>
        <SnapshotProvider>
          <>
            <Head>
              <title>NewAnime</title>
            </Head>
            <Component {...pageProps} />
          </>
        </SnapshotProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}
