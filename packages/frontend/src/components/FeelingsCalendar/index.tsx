import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";
import ImageTile from "components/ImageTile";
import dayjs from "dayjs";
import useFeelings from "hooks/useFeelings";
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
  const { feelings } = useFeelings({
    date: [
      dayjs(activeStartDate).add(-6, "day").format("YYYY-MM-DD"),
      dayjs(activeStartDate).endOf("month").add(6, "day").format("YYYY-MM-DD"),
    ],
  });
  const tileContent = useCallback<
    ({ date }: { date: Date }) => JSX.Element | null
  >(
    ({ date }) => {
      if (!feelings || !feelings.data) {
        return null;
      }

      const foundDate = feelings.data.find(
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
    [feelings]
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
