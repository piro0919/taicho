import { ComponentProps } from "react";
import {
  GoogleLoginButton,
  TwitterLoginButton,
} from "react-social-login-buttons";
import { useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type SignInProps = {
  isLoading: boolean;
  onSignInGoogle: ComponentProps<typeof GoogleLoginButton>["onClick"];
  onSignInTwitter: ComponentProps<typeof TwitterLoginButton>["onClick"];
};

function SignIn({
  isLoading,
  onSignInGoogle,
  onSignInTwitter,
}: SignInProps): JSX.Element {
  const { height } = useWindowSize();

  return (
    <div
      className={styles.wrapper}
      style={{ height, filter: `blur(${isLoading ? 1 : 0}px)` }}
    >
      <div className={styles.inner}>
        <GoogleLoginButton
          align="center"
          className={styles.button}
          onClick={onSignInGoogle}
          text="Googleでサインインする"
        />
        <TwitterLoginButton
          align="center"
          className={styles.button}
          onClick={onSignInTwitter}
          text="Twitterでサインインする"
        />
      </div>
    </div>
  );
}

export default SignIn;
