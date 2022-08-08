import { ConditionListResponse } from "@taicho/api";
import { useUser } from "next-firebase-authentication";
import { GetConditionsData } from "pages/api/conditions";
import { stringifyUrl } from "query-string";
import useSWR, { KeyedMutator } from "swr";

export type ConditionsParams = {
  date?: string | string[];
};

export type ConditionsData = {
  conditions?: ConditionListResponse;
  conditionsMutate: KeyedMutator<ConditionListResponse>;
};

function useConditions({ date }: ConditionsParams): ConditionsData {
  const { user } = useUser();
  const { data, mutate } = useSWR<GetConditionsData>(
    date && user?.uid
      ? stringifyUrl({
          query: {
            [`filters[date][${typeof date === "string" ? "$eq" : "$between"}]`]:
              date,
            "filters[uid][$eq]": user.uid,
          },
          url: "/api/conditions",
        })
      : null
  );

  return {
    conditions: data,
    conditionsMutate: mutate,
  };
}

export default useConditions;
