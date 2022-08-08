import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";
import ImageTile from "components/ImageTile";
import dayjs from "dayjs";
import useConditions from "hooks/useConditions";
import { useCallback } from "react";

export type ConditionsCalendarProps = Pick<
  CalendarProps,
  | "activeStartDate"
  | "onActiveStartDateChange"
  | "onClickDay"
  | "onSwipedLeft"
  | "onSwipedRight"
>;

function ConditionsCalendar({
  activeStartDate,
  onActiveStartDateChange,
  onClickDay,
  onSwipedLeft,
  onSwipedRight,
}: ConditionsCalendarProps): JSX.Element {
  const { conditions } = useConditions({
    date: [
      dayjs(activeStartDate).add(-6, "day").format("YYYY-MM-DD"),
      dayjs(activeStartDate).endOf("month").add(6, "day").format("YYYY-MM-DD"),
    ],
  });
  const tileContent = useCallback<
    ({ date }: { date: Date }) => JSX.Element | null
  >(
    ({ date }) => {
      if (!conditions || !conditions.data) {
        return null;
      }

      const foundDate = conditions.data.find(
        ({ attributes }) =>
          attributes?.date && dayjs(date).isSame(attributes.date, "date")
      );

      return foundDate?.attributes?.value ? (
        <ImageTile
          alt={foundDate.attributes.value}
          src={`/${foundDate.attributes.value}.png`}
        />
      ) : null;
    },
    [conditions]
  );

  return (
    <NoSSR>
      <Calendar
        activeStartDate={activeStartDate}
        name="体調カレンダー"
        onActiveStartDateChange={onActiveStartDateChange}
        onClickDay={onClickDay}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        tileContent={tileContent}
      />
    </NoSSR>
  );
}

export default ConditionsCalendar;
