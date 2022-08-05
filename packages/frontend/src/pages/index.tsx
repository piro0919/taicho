import axios, { AxiosResponse } from "axios";
import NewPortal, { NewPortalProps } from "components/NewPortal";
import Seo from "components/Seo";
import Top from "components/Top";
import dayjs from "dayjs";
import signout from "libs/signout";
import { GetServerSideProps } from "next";
import { useUser } from "next-firebase-authentication";
import { verifyIdToken } from "next-firebase-authentication/dist/verifyIdToken";
import { stringifyUrl } from "query-string";
import { useCallback, useMemo } from "react";
import useSWR, { mutate } from "swr";
import {
  GetConditionsData,
  PostConditionsBody,
  PostConditionsData,
} from "./api/conditions";
import {
  GetFeelingsData,
  PostFeelingsBody,
  PostFeelingsData,
} from "./api/feelings";

function Pages(): JSX.Element {
  const { user } = useUser();
  const { data: conditions, mutate: conditionsMutate } =
    useSWR<GetConditionsData>(
      user?.uid
        ? stringifyUrl({
            query: {
              "filters[date][$eq]": dayjs().format("YYYY-MM-DD"),
              "filters[uid][$eq]": user.uid,
            },
            url: "/api/conditions",
          })
        : null
    );
  const { data: feelings, mutate: feelingsMutate } = useSWR<GetFeelingsData>(
    user?.uid
      ? stringifyUrl({
          query: {
            "filters[date][$eq]": dayjs().format("YYYY-MM-DD"),
            "filters[uid][$eq]": user.uid,
          },
          url: "/api/feelings",
        })
      : null
  );
  const handleSubmit = useCallback<NewPortalProps["onSubmit"]>(
    async ({ condition, feeling }) => {
      if (!user?.uid || !condition || !feeling) {
        return;
      }

      await Promise.all([
        axios
          .post<
            PostConditionsData,
            AxiosResponse<PostConditionsData>,
            PostConditionsBody
          >("/api/conditions", {
            data: {
              date: dayjs().format("YYYY-MM-DD"),
              uid: user.uid,
              value: condition,
            },
          })
          .then(async () => {
            await Promise.all([
              conditionsMutate(),
              mutate(
                stringifyUrl({
                  query: {
                    "filters[date][$between]": [
                      dayjs()
                        .startOf("month")
                        .add(-6, "day")
                        .format("YYYY-MM-DD"),
                      dayjs().endOf("month").add(6, "day").format("YYYY-MM-DD"),
                    ],
                    "filters[uid][$eq]": user.uid,
                  },
                  url: "/api/conditions",
                })
              ),
            ]);
          }),
        axios
          .post<
            PostFeelingsData,
            AxiosResponse<PostFeelingsData>,
            PostFeelingsBody
          >("/api/feelings", {
            data: {
              date: dayjs().format("YYYY-MM-DD"),
              uid: user.uid,
              value: feeling,
            },
          })
          .then(async () => {
            await Promise.all([
              feelingsMutate(),
              mutate(
                stringifyUrl({
                  query: {
                    "filters[date][$between]": [
                      dayjs()
                        .startOf("month")
                        .add(-6, "day")
                        .format("YYYY-MM-DD"),
                      dayjs().endOf("month").add(6, "day").format("YYYY-MM-DD"),
                    ],
                    "filters[uid][$eq]": user.uid,
                  },
                  url: "/api/feelings",
                })
              ),
            ]);
          }),
      ]);
    },
    [conditionsMutate, feelingsMutate, user?.uid]
  );
  const isOpen = useMemo(() => {
    if (!conditions?.data || !feelings?.data) {
      return false;
    }

    return !conditions.data.length || !feelings.data.length;
  }, [conditions?.data, feelings?.data]);

  return (
    <>
      <Seo />
      <Top isOpen={isOpen} />
      {isOpen ? <NewPortal onSubmit={handleSubmit} /> : null}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    await verifyIdToken(ctx);

    return {
      props: {},
    };
  } catch {
    return signout;
  }
};

export default Pages;
