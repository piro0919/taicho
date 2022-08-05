import NoSSR from "@mpth/react-no-ssr";
import Loading from "components/Loading";
import Seo from "components/Seo";
import SignIn from "components/SignIn";
import UserCredentialContext from "contexts/UserCredentialContext";
import { useSignIn, useUser } from "next-firebase-authentication";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

function Signin(): JSX.Element {
  const { isLoading, user } = useUser();
  const { userCredential } = useContext(UserCredentialContext);
  const { signInWithGoogle, signInWithTwitter } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    if (!user || !userCredential) {
      return;
    }

    router.replace("/");
  }, [router, user, userCredential]);

  return (
    <>
      <Seo noindex={true} title="サインイン" />
      <NoSSR>
        <SignIn
          isLoading={isLoading}
          onSignInGoogle={signInWithGoogle}
          onSignInTwitter={signInWithTwitter}
        />
      </NoSSR>
      {isLoading ? <Loading /> : null}
    </>
  );
}

export default Signin;
