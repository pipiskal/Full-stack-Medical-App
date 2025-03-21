import '@/styles/globals.scss';

import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Public_Sans } from 'next/font/google';
import Head from 'next/head';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';

import { LanguageProvider } from '@/context/LanguageProvider';

type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export const metadata = {
  title: 'EnoMed',
  description: 'Enospace medical app',
};

const public_sans = Public_Sans({
  subsets: ['latin', 'latin-ext'],
});

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const { getLayout } = Component;

  return (
    <LanguageProvider>
      <Head>
        <title>{metadata.title}</title>
        <meta name="title" content={metadata.title} />
        <meta name="description" content={metadata.description} />
        {/* <meta name="keywords" content={keywords} />
        <meta property="og:url" content={url} />
        <meta name="author" content={author} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={SEO_Title} key="title" />
        <meta property="og:type" content="website" />
        <meta property="og:description" content={description} />
        <meta property="og:keywords" content={keywords} /> */}
      </Head>
      <ToastContainer />

      <main style={public_sans.style}>
        {getLayout ? (
          getLayout(<Component {...pageProps} />)
        ) : (
          <Component {...pageProps} />
        )}
      </main>
    </LanguageProvider>
  );
}
