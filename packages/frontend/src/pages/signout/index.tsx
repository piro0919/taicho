import Seo from "components/Seo";
import { useSignOut } from "next-firebase-authentication";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Signout(): JSX.Element {
  const router = useRouter();
  const { isSignedOut, signOut } = useSignOut();

  useEffect(() => {
    signOut();
  }, [signOut]);

  useEffect(() => {
    if (!isSignedOut) {
      return;
    }

    router.replace("/");
  }, [router, isSignedOut]);

  return <Seo noindex={true} title="サインアウト" />;
}

export default Signout;
