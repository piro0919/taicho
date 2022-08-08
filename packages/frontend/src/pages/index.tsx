/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NoSSR from "@mpth/react-no-ssr";
import axios, { AxiosResponse } from "axios";
import Landing from "components/Landing";
import NewPortal, { NewPortalProps } from "components/NewPortal";
import Seo from "components/Seo";
import Top, { TopProps } from "components/Top";
import dayjs from "dayjs";
import { GetServerSideProps } from "next";
import { useUser } from "next-firebase-authentication";
import { verifyIdToken } from "next-firebase-authentication/dist/verifyIdToken";
import { stringifyUrl } from "query-string";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useBoolean } from "usehooks-ts";
import {
  GetConditionsData,
  PostConditionsBody,
  PostConditionsData,
} from "./api/conditions";
import {
  PutConditionsIdData,
  PutConditionsIdBody,
} from "./api/conditions/[id]";
import {
  GetFeelingsData,
  PostFeelingsBody,
  PostFeelingsData,
} from "./api/feelings";
import { PutFeelingsIdData, PutFeelingsIdBody } from "./api/feelings/[id]";

export type PagesProps = {
  isSignedIn: boolean;
};

function Pages({ isSignedIn }: PagesProps): JSX.Element {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dayjs().toDate()
  );
  const {
    data: conditions,
    isValidating: conditionsIsValidating,
    mutate: conditionsMutate,
  } = useSWR<GetConditionsData>(
    selectedDate && user?.uid
      ? stringifyUrl({
          query: {
            "filters[date][$eq]": dayjs(selectedDate).format("YYYY-MM-DD"),
            "filters[uid][$eq]": user.uid,
          },
          url: "/api/conditions",
        })
      : null
  );
  const {
    data: feelings,
    isValidating: feelingsIsValidating,
    mutate: feelingsMutate,
  } = useSWR<GetFeelingsData>(
    selectedDate && user?.uid
      ? stringifyUrl({
          query: {
            "filters[date][$eq]": dayjs(selectedDate).format("YYYY-MM-DD"),
            "filters[uid][$eq]": user.uid,
          },
          url: "/api/feelings",
        })
      : null
  );
  const [defaultValues, setDefaultValues] =
    useState<NewPortalProps["defaultValues"]>();
  const [activeStartDate, setActiveStartDate] = useState(
    dayjs().startOf("month").toDate()
  );
  const { data: feelings2, mutate: feelings2Mutate } = useSWR<GetFeelingsData>(
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
  const { data: conditions2, mutate: conditions2Mutate } =
    useSWR<GetConditionsData>(
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
  const handleSubmit = useCallback<NewPortalProps["onSubmit"]>(
    async ({ condition, feeling }) => {
      if (!user?.uid || !condition || !feeling || !selectedDate) {
        return;
      }

      const myPromise = Promise.all([
        (conditions?.data && conditions?.data.length
          ? axios.put<
              PutConditionsIdData,
              AxiosResponse<PutConditionsIdData>,
              PutConditionsIdBody
            >(`/api/conditions/${conditions.data[0].id}`, {
              data: {
                date: dayjs(selectedDate).format("YYYY-MM-DD"),
                uid: user.uid,
                value: condition,
              },
            })
          : axios.post<
              PostConditionsData,
              AxiosResponse<PostConditionsData>,
              PostConditionsBody
            >("/api/conditions", {
              data: {
                date: dayjs(selectedDate).format("YYYY-MM-DD"),
                uid: user.uid,
                value: condition,
              },
            })
        ).then(async () => {
          await Promise.all([conditionsMutate(), conditions2Mutate()]);
        }),
        (feelings?.data && feelings?.data.length
          ? axios.put<
              PutFeelingsIdData,
              AxiosResponse<PutFeelingsIdData>,
              PutFeelingsIdBody
            >(`/api/feelings/${feelings.data[0].id}`, {
              data: {
                date: dayjs(selectedDate).format("YYYY-MM-DD"),
                uid: user.uid,
                value: feeling,
              },
            })
          : axios.post<
              PostFeelingsData,
              AxiosResponse<PostFeelingsData>,
              PostFeelingsBody
            >("/api/feelings", {
              data: {
                date: dayjs(selectedDate).format("YYYY-MM-DD"),
                uid: user.uid,
                value: feeling,
              },
            })
        ).then(async () => {
          await Promise.all([feelingsMutate(), feelings2Mutate()]);
        }),
      ]);

      await toast.promise(myPromise, {
        error: "エラーが発生しました…",
        loading: "保存中です…",
        success: "保存しました！",
      });

      setSelectedDate(undefined);
    },
    [
      conditions?.data,
      conditions2Mutate,
      conditionsMutate,
      feelings?.data,
      feelings2Mutate,
      feelingsMutate,
      selectedDate,
      user?.uid,
    ]
  );
  const [toastId, setToastId] = useState("");
  const isOpen = useMemo(
    () => !!defaultValues && !!selectedDate,
    [defaultValues, selectedDate]
  );
  const handleClose = useCallback(() => {
    setSelectedDate(undefined);
  }, []);
  const { setFalse: onIsFalse, value: isFirst } = useBoolean(true);
  const handleClickDay = useCallback<NonNullable<TopProps["onClickDay"]>>(
    (date) => {
      if (dayjs(date).isAfter(dayjs())) {
        toast.error("未来の調子はまだ入力できません");

        return;
      }

      onIsFalse();

      setSelectedDate(date);
    },
    [onIsFalse]
  );
  const handleActiveStartDateChange = useCallback<
    NonNullable<TopProps["onActiveStartDateChange"]>
  >(
    ({ activeStartDate }) => {
      setActiveStartDate(activeStartDate);
    },
    [setActiveStartDate]
  );
  const feelingsDates = useMemo<TopProps["feelingsDates"]>(
    () =>
      feelings2?.data
        ? feelings2.data.map(({ attributes }) => ({
            date: attributes?.date!,
            value: attributes?.value!,
          }))
        : [],
    [feelings2]
  );
  const conditionsDates = useMemo<TopProps["conditionsDates"]>(
    () =>
      conditions2?.data
        ? conditions2.data.map(({ attributes }) => ({
            date: attributes?.date!,
            value: attributes?.value!,
          }))
        : [],
    [conditions2]
  );
  const handleDragEnd = useCallback<TopProps["onDragEnd"]>(
    ({ movement: [movementX] }) => {
      if (Math.abs(movementX) < 50) {
        return;
      }

      setActiveStartDate((prevActiveStartDate) =>
        dayjs(prevActiveStartDate)
          .add(movementX >= 0 ? -1 : 1, "month")
          .toDate()
      );
    },
    []
  );

  useEffect(() => {
    if (!conditionsIsValidating || !feelingsIsValidating) {
      return;
    }

    toast.dismiss(toastId);
  }, [
    conditions,
    conditionsIsValidating,
    feelings,
    feelingsIsValidating,
    toastId,
  ]);

  useEffect(() => {
    if (!conditions?.data || !feelings?.data) {
      return;
    }

    if (!conditions.data.length || !feelings.data.length) {
      setDefaultValues({
        condition: "",
        feeling: "",
      });

      return;
    }

    if (isFirst) {
      return;
    }

    setDefaultValues({
      condition: conditions.data[0].attributes?.value || "",
      feeling: feelings.data[0].attributes?.value || "",
    });
  }, [
    conditions,
    conditionsIsValidating,
    feelings,
    feelingsIsValidating,
    isFirst,
    selectedDate,
    toastId,
  ]);

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    const toastId = toast.loading("データを取得中です…");

    setToastId(toastId);
  }, [isSignedIn]);

  useEffect(() => {
    if (selectedDate) {
      return;
    }

    setDefaultValues(undefined);
  }, [selectedDate]);

  return (
    <>
      <Seo />
      {isSignedIn ? (
        <>
          <Top
            activeStartDate={activeStartDate}
            conditionsDates={conditionsDates}
            feelingsDates={feelingsDates}
            isOpen={isOpen}
            onActiveStartDateChange={handleActiveStartDateChange}
            onClickDay={handleClickDay}
            onDragEnd={handleDragEnd}
          />
          {defaultValues && isOpen ? (
            <NewPortal
              defaultValues={defaultValues}
              onClose={handleClose}
              onSubmit={handleSubmit}
            />
          ) : null}
        </>
      ) : (
        <NoSSR>
          <Landing />
        </NoSSR>
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<PagesProps> = async (
  ctx
) => {
  try {
    await verifyIdToken(ctx);

    return {
      props: {
        isSignedIn: true,
      },
    };
  } catch {
    return {
      props: {
        isSignedIn: false,
      },
    };
  }
};

export default Pages;
