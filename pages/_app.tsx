import '@fontsource/rubik';
import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import { RecoilRoot } from 'recoil';

import SnapshotProvider from '../components/firebase/SnapshotProvider';

import type { AppProps } from "next/app";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <SessionProvider session={pageProps.session}>
        <SnapshotProvider>
          <Component {...pageProps} />
        </SnapshotProvider>
      </SessionProvider>
    </RecoilRoot>
  );
}
