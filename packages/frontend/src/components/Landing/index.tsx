import Button, { ButtonProps } from "components/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

function Landing(): JSX.Element {
  const { height } = useWindowSize();
  const router = useRouter();
  const handleClick = useCallback<NonNullable<ButtonProps["onClick"]>>(() => {
    router.push("/signin");
  }, [router]);

  return (
    <div className={styles.wrapper} style={{ height }}>
      <div className={styles.inner}>
        <div className={styles.inner2}>
          <div className={styles.heading1Wrapper}>
            <h1>たいちょ</h1>
          </div>
          <div className={styles.imageWrapper}>
            <div className={styles.imageWrapper2}>
              <Image
                alt="top"
                layout="fill"
                objectFit="contain"
                src="/6117b8653c763681ae880e85_87.png"
              />
            </div>
          </div>
          <div className={styles.textsWrapper}>
            <p>たいちょはあなたの調子を管理してくれるサポートアプリです。</p>
            <div className={styles.buttonWrapper}>
              <Button onClick={handleClick}>使ってみる</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
