import { Root, List, Trigger, Content } from "@radix-ui/react-tabs";
import ConditionsCalendar, {
  ConditionsCalendarProps,
} from "components/ConditionsCalendar";
import FeelingsCalendar, {
  FeelingsCalendarProps,
} from "components/FeelingsCalendar";
import Settings from "components/Settings";
import { BsGear, BsPerson, BsSuitHeart } from "react-icons/bs";
import { useWindowSize } from "usehooks-ts";
import styles from "./style.module.scss";

export type TopProps = Pick<
  ConditionsCalendarProps,
  | "activeStartDate"
  | "onActiveStartDateChange"
  | "onClickDay"
  | "onSwipedLeft"
  | "onSwipedRight"
> &
  Pick<
    FeelingsCalendarProps,
    | "activeStartDate"
    | "onActiveStartDateChange"
    | "onClickDay"
    | "onSwipedLeft"
    | "onSwipedRight"
    | "onSwipedLeft"
    | "onSwipedRight"
  > & {
    conditionsDates: ConditionsCalendarProps["dates"];
    feelingsDates: FeelingsCalendarProps["dates"];
    isOpen: boolean;
  };

function Top({
  activeStartDate,
  conditionsDates,
  feelingsDates,
  isOpen,
  onActiveStartDateChange,
  onClickDay,
  onSwipedLeft,
  onSwipedRight,
}: TopProps): JSX.Element {
  const { height } = useWindowSize();

  return (
    <Root
      className={styles.root}
      defaultValue="FeelingsCalendar"
      style={{ height, filter: `blur(${isOpen ? 1 : 0}px)` }}
    >
      <Content className={styles.content} value="FeelingsCalendar">
        <FeelingsCalendar
          activeStartDate={activeStartDate}
          dates={feelingsDates}
          onActiveStartDateChange={onActiveStartDateChange}
          onClickDay={onClickDay}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
        />
      </Content>
      <Content className={styles.content} value="ConditionsCalendar">
        <ConditionsCalendar
          activeStartDate={activeStartDate}
          dates={conditionsDates}
          onActiveStartDateChange={onActiveStartDateChange}
          onClickDay={onClickDay}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
        />
      </Content>
      {/* <Content className={styles.content} value="tab3" /> */}
      <Content className={styles.content} value="Settings">
        <Settings />
      </Content>
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
        <Trigger className={styles.trigger} value="Settings">
          <BsGear size={18} />
          <span>設定</span>
        </Trigger>
      </List>
    </Root>
  );
}

export default Top;
