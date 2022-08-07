import dayjs from "dayjs";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import ReactCalendar, {
  CalendarProps as ReactCalendarProps,
} from "react-calendar";
import { BsCaretLeftFill, BsCaretRightFill } from "react-icons/bs";
import styles from "./style.module.scss";

type DateType = {
  date: string;
  value: "excellent" | "veryGood" | "good" | "average" | "poor" | "";
};

export type CalendarProps = Pick<
  ReactCalendarProps,
  "activeStartDate" | "onActiveStartDateChange" | "onClickDay"
> & {
  dates: DateType[];
  name: string;
};

function Calendar({
  activeStartDate,
  dates,
  name,
  onActiveStartDateChange,
  onClickDay,
}: CalendarProps): JSX.Element {
  const [value, onChange] = useState<ReactCalendarProps["value"]>(
    dayjs().toDate()
  );

  return (
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
      tileContent={({ date }): JSX.Element => {
        if (!dates) {
          return <Fragment />;
        }

        const foundDate = dates.find(({ date: dateDate }) =>
          dayjs(date).isSame(dateDate, "date")
        );

        return foundDate?.value ? (
          <div className={styles.imageWrapper}>
            <Image
              alt={foundDate.value}
              layout="fill"
              objectFit="contain"
              priority={true}
              src={`/${foundDate.value}.png`}
            />
          </div>
        ) : (
          <Fragment />
        );
      }}
      value={value}
    />
  );
}

export default Calendar;
