import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import ConditionsCalendar from "components/ConditionsCalendar";
import FeelingsCalendar from "components/FeelingsCalendar";
import { BsGear, BsPerson, BsSuitHeart } from "react-icons/bs";
import { useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type TopProps = {
  isOpen: boolean;
};

function Top({ isOpen }: TopProps): JSX.Element {
  const { height } = useWindowSize();

  return (
    <Root
      className={styles.root}
      defaultValue="tab1"
      style={{ height, filter: `blur(${isOpen ? 1 : 0}px)` }}
    >
      <Content className={styles.content} value="FeelingsCalendar">
        <FeelingsCalendar />
      </Content>
      <Content className={styles.content} value="ConditionsCalendar">
        <ConditionsCalendar />
      </Content>
      {/* <Content className={styles.content} value="tab3" /> */}
      <Content className={styles.content} value="tab4" />
      <List className={styles.list}>
        <Trigger className={styles.trigger} value="FeelingsCalendar">
          <BsSuitHeart size={18} />
          <span>気分</span>
        </Trigger>
        <Trigger className={styles.trigger} value="ConditionsCalendar">
          <BsPerson size={18} />
          <span>体調</span>
        </Trigger>
        {/* <Trigger className={styles.trigger} value="tab3">
          <BsGraphUp size={18} />
          <span>グラフ</span>
        </Trigger> */}
        <Trigger className={styles.trigger} value="tab4">
          <BsGear size={18} />
          <span>設定</span>
        </Trigger>
      </List>
    </Root>
  );
}

export default Top;
