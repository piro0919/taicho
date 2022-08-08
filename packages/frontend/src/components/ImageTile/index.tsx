import Image from "next/image";
import styles from "./style.module.scss";

export type ImageTileProps = {
  alt: string;
  src: string;
};

function ImageTile({ alt, src }: ImageTileProps): JSX.Element {
  return (
    <div className={styles.wrapper}>
      <Image
        alt={alt}
        layout="fill"
        objectFit="contain"
        priority={true}
        src={src}
      />
    </div>
  );
}

export default ImageTile;
