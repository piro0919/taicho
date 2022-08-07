import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";

export type ConditionsCalendarProps = Pick<
  CalendarProps,
  "dates" | "onClickDay" | "onActiveStartDateChange"
> & {
  activeStartDate: Date;
};

function ConditionsCalendar({
  activeStartDate,
  dates,
  onActiveStartDateChange,
  onClickDay,
}: ConditionsCalendarProps): JSX.Element {
  return (
    <NoSSR>
      <Calendar
        activeStartDate={activeStartDate}
        dates={dates}
        name="体調カレンダー"
        onActiveStartDateChange={onActiveStartDateChange}
        onClickDay={onClickDay}
      />
    </NoSSR>
  );
}

export default ConditionsCalendar;
