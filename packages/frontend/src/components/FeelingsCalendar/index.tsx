import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";

export type FeelingsCalendarProps = Pick<
  CalendarProps,
  | "dates"
  | "onActiveStartDateChange"
  | "onClickDay"
  | "onSwipedLeft"
  | "onSwipedRight"
> & {
  activeStartDate: Date;
};

function FeelingsCalendar({
  activeStartDate,
  dates,
  onActiveStartDateChange,
  onClickDay,
  onSwipedLeft,
  onSwipedRight,
}: FeelingsCalendarProps): JSX.Element {
  return (
    <NoSSR>
      <Calendar
        activeStartDate={activeStartDate}
        dates={dates}
        name="気分カレンダー"
        onActiveStartDateChange={onActiveStartDateChange}
        onClickDay={onClickDay}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
      />
    </NoSSR>
  );
}

export default FeelingsCalendar;
