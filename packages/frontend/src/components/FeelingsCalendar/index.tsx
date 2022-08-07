import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";

export type FeelingsCalendarProps = Pick<
  CalendarProps,
  "dates" | "onClickDay" | "onActiveStartDateChange"
> & {
  activeStartDate: Date;
};

function FeelingsCalendar({
  activeStartDate,
  dates,
  onActiveStartDateChange,
  onClickDay,
}: FeelingsCalendarProps): JSX.Element {
  return (
    <NoSSR>
      <Calendar
        activeStartDate={activeStartDate}
        dates={dates}
        name="気分カレンダー"
        onActiveStartDateChange={onActiveStartDateChange}
        onClickDay={onClickDay}
      />
    </NoSSR>
  );
}

export default FeelingsCalendar;
