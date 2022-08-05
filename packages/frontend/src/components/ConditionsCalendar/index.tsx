/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NoSSR from "@mpth/react-no-ssr";
import Calendar, { CalendarProps } from "components/Calendar";
import dayjs from "dayjs";
import { useUser } from "next-firebase-authentication";
import { GetConditionsData } from "pages/api/conditions";
import { stringifyUrl } from "query-string";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

function ConditionsCalendar(): JSX.Element {
  const { user } = useUser();
  const [activeStartDate, setActiveStartDate] = useState(
    dayjs().startOf("month").toDate()
  );
  const { data: conditions } = useSWR<GetConditionsData>(
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
          url: "/api/conditions",
        })
      : null
  );
  const dates = useMemo<CalendarProps["dates"]>(
    () =>
      conditions?.data
        ? conditions.data.map(({ attributes }) => ({
            date: attributes?.date!,
            value: attributes?.value!,
          }))
        : [],
    [conditions]
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

export default ConditionsCalendar;
