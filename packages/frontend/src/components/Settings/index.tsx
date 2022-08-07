import Button from "components/Button";
import PwaContext from "contexts/PwaContext";
import { useRouter } from "next/router";
import { useCallback, useContext } from "react";
import styles from "./style.module.scss";

function Settings(): JSX.Element {
  const router = useRouter();
  const handleSignout = useCallback(() => {
    router.replace("/signout");
  }, [router]);
  const {
    appinstalled,
    canInstallprompt,
    enabledPwa,
    isPwa,
    showInstallPrompt,
  } = useContext(PwaContext);

  return (
    <div className={styles.wrapper}>
      {!appinstalled && canInstallprompt && enabledPwa && !isPwa ? (
        <Button onClick={showInstallPrompt}>インストールする</Button>
      ) : null}
      <Button onClick={handleSignout}>サインアウトする</Button>
    </div>
  );
}

export default Settings;
