import PwaContext from "contexts/PwaContext";
import UserCredentialContext from "contexts/UserCredentialContext";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import fetcher from "libs/fetcher";
import localStorageProvider from "libs/localStorageProvider";
import { NextPage } from "next";
import { useInitAuth } from "next-firebase-authentication";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ReactElement, ReactNode } from "react";
import "react-calendar/dist/Calendar.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
          provider:
            typeof window === "undefined" ? undefined : localStorageProvider,
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
      <ToastContainer
        autoClose={2000}
        closeButton={false}
        hideProgressBar={true}
        pauseOnHover={false}
        position="bottom-center"
        style={{ width: "340px" }}
      />
    </>
  );
}

export default MyApp;
