import NoSSR from "@mpth/react-no-ssr";
import PwaContext from "contexts/PwaContext";
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
import { Toaster } from "react-hot-toast";
import "ress";
import "styles/globals.scss";
import "styles/mq-settings.scss";
import { SWRConfig } from "swr";
import usePwa from "use-pwa";

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
  const {
    appinstalled,
    canInstallprompt,
    enabledPwa,
    isPwa,
    showInstallPrompt,
  } = usePwa();

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
          // provider:
          //   typeof window === "undefined" ? undefined : localStorageProvider,
          revalidateIfStale: false,
          revalidateOnFocus: false,
        }}
      >
        <PwaContext.Provider
          value={{
            appinstalled,
            canInstallprompt,
            enabledPwa,
            isPwa,
            showInstallPrompt,
          }}
        >
          <UserCredentialContext.Provider value={{ userCredential }}>
            {getLayout(<Component {...pageProps} />)}
          </UserCredentialContext.Provider>
        </PwaContext.Provider>
      </SWRConfig>
      <NoSSR>
        <Toaster position="bottom-center" />
      </NoSSR>
    </>
  );
}

export default MyApp;
