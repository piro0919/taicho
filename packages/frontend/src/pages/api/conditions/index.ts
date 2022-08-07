import { ConditionListResponse, ConditionRequest } from "@taicho/api";
import { AxiosResponse } from "axios";
import fetchStrapi from "libs/fetchStrapi";
import options from "libs/options";
import verifyIdTokenMiddleware from "libs/verifyIdTokenMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { stringifyUrl } from "query-string";

export type GetConditionsQuery = Record<string, never>;

export type GetConditionsData = ConditionListResponse;

type ExtendedGetRequest = {
  query: GetConditionsQuery;
};

type ExtendedGetResponse = {
  json: (body: GetConditionsData) => void;
};

export type PostConditionsBody = ConditionRequest;

export type PostConditionsData = ConditionListResponse;

type ExtendedPostRequest = {
  body: PostConditionsBody;
};

type ExtendedPostResponse = {
  json: (body: PostConditionsData) => void;
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<ExtendedGetResponse | ExtendedPostResponse>
>(options)
  .use(verifyIdTokenMiddleware)
  .get<ExtendedGetRequest, ExtendedGetResponse>(async ({ query }, res) => {
    const { data: conditions } = await fetchStrapi.get<
      GetConditionsData,
      AxiosResponse<GetConditionsData>
    >(
      stringifyUrl({
        query,
        url: "/api/conditions",
      })
    );

    res.status(200);
    res.json(conditions);
    res.end();
  })
  .post<ExtendedPostRequest, ExtendedPostResponse>(async ({ body }, res) => {
    const { data: conditions } = await fetchStrapi.post<
      PostConditionsData,
      AxiosResponse<PostConditionsData>,
      PostConditionsBody
    >("/api/conditions", body);

    res.status(200);
    res.json(conditions);
    res.end();
  });

export default handler;
