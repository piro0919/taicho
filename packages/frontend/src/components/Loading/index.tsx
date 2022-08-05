import usePortal from "react-cool-portal";
import ScaleLoader from "react-spinners/ScaleLoader";
import styles from "./style.module.scss";

function Loading(): JSX.Element {
  const { Portal } = usePortal({
    defaultShow: true,
  });

  return (
    <Portal>
      <div className={styles.wrapper}>
        <ScaleLoader color="#000" />
      </div>
    </Portal>
  );
}

export default Loading;
