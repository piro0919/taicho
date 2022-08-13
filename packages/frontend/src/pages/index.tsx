import axios, { AxiosResponse } from "axios";
import FormPortal, { FormPortalProps } from "components/FormPortal";
import Landing from "components/Landing";
import Seo from "components/Seo";
import Top, { TopProps } from "components/Top";
import dayjs from "dayjs";
import useConditions from "hooks/useConditions";
import { GetServerSideProps } from "next";
import { useUser } from "next-firebase-authentication";
import { verifyIdToken } from "next-firebase-authentication/dist/verifyIdToken";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Id, toast } from "react-toastify";
import { useBoolean } from "usehooks-ts";
import { PostConditionsData, PostConditionsBody } from "./api/conditions";
import {
  PutConditionsIdData,
  PutConditionsIdBody,
} from "./api/conditions/[id]";

export type PagesProps = {
  isSignedIn: boolean;
};

function Pages({ isSignedIn }: PagesProps): JSX.Element {
  const [activeStartDate, setActiveStartDate] = useState<
    TopProps["activeStartDate"]
  >(dayjs().startOf("month").toDate());
  const handleActiveStartDateChange = useCallback<
    NonNullable<TopProps["onActiveStartDateChange"]>
  >(
    ({ activeStartDate }) => {
      setActiveStartDate(activeStartDate);
    },
    [setActiveStartDate]
  );
  const { setFalse: offIsFirst, value: isFirst } = useBoolean(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    dayjs().toDate()
  );
  const handleClickDay = useCallback<NonNullable<TopProps["onClickDay"]>>(
    (date) => {
      if (dayjs(date).isAfter(dayjs())) {
        toast.error("未来の調子はまだ入力できません");

        return;
      }

      offIsFirst();

      setSelectedDate(date);
    },
    [offIsFirst]
  );
  const handleSwipedLeft = useCallback<TopProps["onSwipedLeft"]>(() => {
    setActiveStartDate((prevActiveStartDate) =>
      dayjs(prevActiveStartDate).add(1, "month").toDate()
    );
  }, []);
  const handleSwipedRight = useCallback<TopProps["onSwipedRight"]>(() => {
    setActiveStartDate((prevActiveStartDate) =>
      dayjs(prevActiveStartDate).add(-1, "month").toDate()
    );
  }, []);
  const [toastId, setToastId] = useState<Id>();
  const [defaultValues, setDefaultValues] =
    useState<FormPortalProps["defaultValues"]>();
  const params = useMemo(
    () => ({
      date: selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "",
    }),
    [selectedDate]
  );
  const { conditions, conditionsMutate } = useConditions(params);
  const isOpen = useMemo(
    () => !!defaultValues && !!selectedDate,
    [defaultValues, selectedDate]
  );
  const handleClose = useCallback<FormPortalProps["onClose"]>(() => {
    setSelectedDate(undefined);
  }, []);
  const { user } = useUser();
  const query = useMemo(
    () => ({
      date: [
        dayjs(activeStartDate).add(-6, "day").format("YYYY-MM-DD"),
        dayjs(activeStartDate)
          .endOf("month")
          .add(6, "day")
          .format("YYYY-MM-DD"),
      ],
    }),
    [activeStartDate]
  );
  const { conditionsMutate: conditionsMutate2 } = useConditions(query);
  const handleSubmit = useCallback<FormPortalProps["onSubmit"]>(
    async ({ condition, feeling, remark }) => {
      if (!condition || !feeling || !user) {
        return;
      }

      const { uid } = user;
      const conditionData = {
        ...params,
        feeling,
        remark,
        uid,
        physicalCondition: condition,
      };
      const myPromise = Promise.all([
        (conditions && conditions.data && conditions.data.length
          ? axios.put<
              PutConditionsIdData,
              AxiosResponse<PutConditionsIdData>,
              PutConditionsIdBody
            >(`/api/conditions/${conditions.data[0].id}`, {
              data: conditionData,
            })
          : axios.post<
              PostConditionsData,
              AxiosResponse<PostConditionsData>,
              PostConditionsBody
            >("/api/conditions", {
              data: conditionData,
            })
        ).then(() => {
          conditionsMutate();
          conditionsMutate2();
        }),
      ]);

      await toast.promise(myPromise, {
        error: "エラーが発生しました…",
        pending: "保存中です…",
        success: "保存しました！",
      });

      setSelectedDate(undefined);
    },
    [conditions, conditionsMutate, conditionsMutate2, params, user]
  );

  useEffect(() => {
    if (!isFirst || !isSignedIn) {
      return;
    }

    const toastId = toast.loading("データを取得中です…");

    setTimeout(() => {
      setToastId(toastId);
    }, 1000);
  }, [isFirst, isSignedIn]);

  useEffect(() => {
    if (isFirst) {
      return;
    }

    if (selectedDate && !defaultValues && !toastId) {
      const toastId = toast.loading("データを取得中です…");

      setToastId(toastId);

      return;
    }

    if (selectedDate && defaultValues && toastId) {
      setToastId(undefined);

      toast.dismiss(toastId);
    }
  }, [defaultValues, isFirst, selectedDate, toastId]);

  useEffect(() => {
    if (selectedDate) {
      return;
    }

    setDefaultValues(undefined);
  }, [selectedDate]);

  useEffect(() => {
    if (!conditions || !toastId) {
      return;
    }

    setToastId(undefined);
    toast.dismiss(toastId);
  }, [conditions, toastId]);

  useEffect(() => {
    if (!conditions || !conditions.data) {
      return;
    }

    if (!conditions.data.length) {
      setDefaultValues({
        condition: "",
        feeling: "",
        remark: "",
      });

      return;
    }

    if (isFirst) {
      return;
    }

    setDefaultValues({
      condition: conditions.data[0].attributes?.physicalCondition || "",
      feeling: conditions.data[0].attributes?.feeling || "",
      remark:
        (conditions.data.length && conditions.data[0].attributes?.remark) || "",
    });
  }, [conditions, isFirst]);

  return (
    <>
      <Seo />
      {isSignedIn ? (
        <>
          <Top
            activeStartDate={activeStartDate}
            isOpen={isOpen}
            onActiveStartDateChange={handleActiveStartDateChange}
            onClickDay={handleClickDay}
            onSwipedLeft={handleSwipedLeft}
            onSwipedRight={handleSwipedRight}
          />
          {defaultValues && isOpen && selectedDate ? (
            <FormPortal
              defaultValues={defaultValues}
              onClose={handleClose}
              onSubmit={handleSubmit}
              selectedDate={selectedDate}
            />
          ) : null}
        </>
      ) : (
        <Landing />
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
