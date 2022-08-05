import NoSSR from "@mpth/react-no-ssr";
import Loading from "components/Loading";
import Seo from "components/Seo";
import SignIn from "components/SignIn";
import { useSignIn, useUser } from "next-firebase-authentication";

function Signin(): JSX.Element {
  const { isLoading } = useUser();
  const { signInWithGoogle, signInWithTwitter } = useSignIn();

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
