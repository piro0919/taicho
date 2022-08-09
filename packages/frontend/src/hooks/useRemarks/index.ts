import { RemarkListResponse } from "@taicho/api";
import { useUser } from "next-firebase-authentication";
import { GetRemarksData } from "pages/api/remarks";
import { stringifyUrl } from "query-string";
import useSWR, { KeyedMutator } from "swr";

export type RemarksParams = {
  date: string;
};

export type RemarksData = {
  remarks?: RemarkListResponse;
  remarksMutate: KeyedMutator<RemarkListResponse>;
};

function useRemarks({ date }: RemarksParams): RemarksData {
  const { user } = useUser();
  const { data, mutate } = useSWR<GetRemarksData>(
    date && user?.uid
      ? stringifyUrl({
          query: {
            "filters[date][$eq]": date,
            "filters[uid][$eq]": user.uid,
          },
          url: "/api/remarks",
        })
      : null
  );

  return {
    remarks: data,
    remarksMutate: mutate,
  };
}

export default useRemarks;
