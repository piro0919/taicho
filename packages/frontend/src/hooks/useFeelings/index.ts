import { ConditionListResponse, FeelingListResponse } from "@taicho/api";
import { useUser } from "next-firebase-authentication";
import { GetFeelingsData } from "pages/api/feelings";
import { stringifyUrl } from "query-string";
import useSWR, { KeyedMutator } from "swr";

export type FeelingsParams = {
  date?: string | string[];
};

export type FeelingsData = {
  feelings?: FeelingListResponse;
  feelingsMutate: KeyedMutator<ConditionListResponse>;
};

function useFeelings({ date }: FeelingsParams): FeelingsData {
  const { user } = useUser();
  const { data, mutate } = useSWR<GetFeelingsData>(
    date && user?.uid
      ? stringifyUrl({
          query: {
            [`filters[date][${typeof date === "string" ? "$eq" : "$between"}]`]:
              date,
            "filters[uid][$eq]": user.uid,
          },
          url: "/api/feelings",
        })
      : null
  );

  return {
    feelings: data,
    feelingsMutate: mutate,
  };
}

export default useFeelings;
