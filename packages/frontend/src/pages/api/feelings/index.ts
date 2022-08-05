import { FeelingRequest, FeelingListResponse } from "@taicho/api";
import { AxiosResponse } from "axios";
import fetchStrapi from "libs/fetchStrapi";
import options from "libs/options";
import verifyIdTokenMiddleware from "libs/verifyIdTokenMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { stringifyUrl } from "query-string";

export type GetFeelingsQuery = Record<string, never>;

export type GetFeelingsData = FeelingListResponse;

type ExtendedGetRequest = {
  query: GetFeelingsQuery;
};

type ExtendedGetResponse = {
  json: (body: GetFeelingsData) => void;
};

export type PostFeelingsBody = FeelingRequest;

export type PostFeelingsData = FeelingListResponse;

type ExtendedPostRequest = {
  body: PostFeelingsBody;
};

type ExtendedPostResponse = {
  json: (body: PostFeelingsData) => void;
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<ExtendedGetResponse | ExtendedPostResponse>
>(options)
  .use(verifyIdTokenMiddleware)
  .get<ExtendedGetRequest, ExtendedGetResponse>(async ({ query }, res) => {
    const { data: feelings } = await fetchStrapi.get<
      GetFeelingsData,
      AxiosResponse<GetFeelingsData>
    >(
      stringifyUrl({
        query,
        url: "/api/feelings",
      })
    );

    res.status(200);
    res.json(feelings);
    res.end();
  })
  .post<ExtendedPostRequest, ExtendedPostResponse>(async ({ body }, res) => {
    const { data: feelings } = await fetchStrapi.post<
      PostFeelingsData,
      AxiosResponse<PostFeelingsData>,
      PostFeelingsBody
    >("/api/feelings", body);

    res.status(200);
    res.json(feelings);
    res.end();
  });

export default handler;
