import UserCredentialContext from "contexts/UserCredentialContext";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import fetcher from "libs/fetcher";
import { NextPage } from "next";
import { useInitAuth } from "next-firebase-authentication";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import "react-calendar/dist/Calendar.css";
import "ress";
import "styles/globals.scss";
import "styles/mq-settings.scss";
import { SWRConfig } from "swr";

dayjs.locale("ja");

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const getLayout = Component.getLayout ?? ((page): ReactNode => page);
  const { userCredential } = useInitAuth();

  return (
    <>
      <Head>
        <meta
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          name="viewport"
        />
        <link href="/manifest.json" rel="manifest" />
        <link href="/logo192.png" rel="apple-touch-icon" />
      </Head>
      <SWRConfig
        value={{
          fetcher,
          revalidateIfStale: false,
          revalidateOnFocus: false,
        }}
      >
        <UserCredentialContext.Provider value={{ userCredential }}>
          {getLayout(<Component {...pageProps} />)}
        </UserCredentialContext.Provider>
      </SWRConfig>
    </>
  );
}

export default MyApp;
