/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";
import dayjs from "dayjs";
import { useUser } from "next-firebase-authentication";
import { GetFeelingsData } from "pages/api/feelings";
import { stringifyUrl } from "query-string";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

function FeelingsCalendar(): JSX.Element {
  const { user } = useUser();
  const [activeStartDate, setActiveStartDate] = useState(
    dayjs().startOf("month").toDate()
  );
  const { data: feelings } = useSWR<GetFeelingsData>(
    user?.uid
      ? stringifyUrl({
          query: {
            "filters[date][$between]": [
              dayjs(activeStartDate).add(-6, "day").format("YYYY-MM-DD"),
              dayjs(activeStartDate)
                .endOf("month")
                .add(6, "day")
                .format("YYYY-MM-DD"),
            ],
            "filters[uid][$eq]": user.uid,
          },
          url: "/api/feelings",
        })
      : null
  );
  const dates = useMemo<CalendarProps["dates"]>(
    () =>
      feelings?.data
        ? feelings.data.map(({ attributes }) => ({
            date: attributes?.date!,
            value: attributes?.value!,
          }))
        : [],
    [feelings]
  );
  const handleActiveStartDateChange = useCallback<
    NonNullable<CalendarProps["onActiveStartDateChange"]>
  >(({ activeStartDate }) => {
    setActiveStartDate(activeStartDate);
  }, []);

  return (
    <NoSSR>
      <Calendar
        dates={dates}
        onActiveStartDateChange={handleActiveStartDateChange}
      />
    </NoSSR>
  );
}

export default FeelingsCalendar;
