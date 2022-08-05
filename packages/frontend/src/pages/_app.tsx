import dayjs from "dayjs";
import "dayjs/locale/ja";
import fetcher from "libs/fetcher";
import { NextPage } from "next";
import { useInitAuth } from "next-firebase-authentication";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { ReactElement, ReactNode, useEffect } from "react";
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
  const router = useRouter();
  const { isSignedIn } = useInitAuth();

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    router.replace("/");
  }, [isSignedIn, router]);

  return (
    <SWRConfig
      value={{
        fetcher,
        revalidateIfStale: false,
        revalidateOnFocus: false,
      }}
    >
      {getLayout(<Component {...pageProps} />)}
    </SWRConfig>
  );
}

export default MyApp;
