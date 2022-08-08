import dayjs from "dayjs";
import React, { useState } from "react";
import ReactCalendar, {
  CalendarProps as ReactCalendarProps,
} from "react-calendar";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import { SwipeCallback, useSwipeable } from "react-swipeable";
import styles from "./style.module.scss";

export type CalendarProps = Pick<
  ReactCalendarProps,
  "activeStartDate" | "onActiveStartDateChange" | "onClickDay" | "tileContent"
> & {
  name: string;
  onSwipedLeft: SwipeCallback;
  onSwipedRight: SwipeCallback;
};

function Calendar({
  activeStartDate,
  name,
  onActiveStartDateChange,
  onClickDay,
  onSwipedLeft,
  onSwipedRight,
  tileContent,
}: CalendarProps): JSX.Element {
  const [value, onChange] = useState<ReactCalendarProps["value"]>(
    dayjs().toDate()
  );
  const handlers = useSwipeable({
    onSwipedLeft,
    onSwipedRight,
    trackMouse: true,
  });

  return (
    <div {...handlers} className={styles.wrapper}>
      <ReactCalendar
        activeStartDate={activeStartDate}
        className={styles.calendar}
        formatDay={(_, date): string => dayjs(date).format("D")}
        navigationLabel={({ date }): string =>
          `${dayjs(date).format("YYYY年 M月")} ${name}`
        }
        next2Label={null}
        nextLabel={<BsCaretRightFill size={16} />}
        onActiveStartDateChange={onActiveStartDateChange}
        onChange={onChange}
        onClickDay={onClickDay}
        prev2Label={null}
        prevLabel={<BsCaretLeftFill size={16} />}
        tileClassName={styles.tile}
        tileContent={tileContent}
        value={value}
      />
    </div>
  );
}

export default Calendar;
