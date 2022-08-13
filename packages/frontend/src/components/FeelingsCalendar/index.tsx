import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";
import ImageTile from "components/ImageTile";
import dayjs from "dayjs";
import useConditions from "hooks/useConditions";
import { useCallback } from "react";

export type FeelingsCalendarProps = Pick<
  CalendarProps,
  | "activeStartDate"
  | "onActiveStartDateChange"
  | "onClickDay"
  | "onSwipedLeft"
  | "onSwipedRight"
>;

function FeelingsCalendar({
  activeStartDate,
  onActiveStartDateChange,
  onClickDay,
  onSwipedLeft,
  onSwipedRight,
}: FeelingsCalendarProps): JSX.Element {
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

      return foundDate?.attributes?.feeling ? (
        <ImageTile
          alt={foundDate.attributes.feeling}
          src={`/${foundDate.attributes.feeling}.png`}
        />
      ) : null;
    },
    [conditions]
  );

  return (
    <NoSSR>
      <Calendar
        activeStartDate={activeStartDate}
        name="気分カレンダー"
        onActiveStartDateChange={onActiveStartDateChange}
        onClickDay={onClickDay}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        tileContent={tileContent}
      />
    </NoSSR>
  );
}

export default FeelingsCalendar;
