import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";

export type ConditionsCalendarProps = Pick<
  CalendarProps,
  | "dates"
  | "onActiveStartDateChange"
  | "onClickDay"
  | "onSwipedLeft"
  | "onSwipedRight"
> & {
  activeStartDate: Date;
};

function ConditionsCalendar({
  activeStartDate,
  dates,
  onActiveStartDateChange,
  onClickDay,
  onSwipedLeft,
  onSwipedRight,
}: ConditionsCalendarProps): JSX.Element {
  return (
    <NoSSR>
      <Calendar
        activeStartDate={activeStartDate}
        dates={dates}
        name="体調カレンダー"
        onActiveStartDateChange={onActiveStartDateChange}
        onClickDay={onClickDay}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
      />
    </NoSSR>
  );
}

export default ConditionsCalendar;
