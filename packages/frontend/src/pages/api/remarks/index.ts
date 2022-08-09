import { RemarkRequest, RemarkListResponse } from "@taicho/api";
import { AxiosResponse } from "axios";
import options from "libs/options";
import strapi from "libs/strapi";
import verifyIdTokenMiddleware from "libs/verifyIdTokenMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import { stringifyUrl } from "query-string";

export type GetRemarksQuery = Record<string, never>;

export type GetRemarksData = RemarkListResponse;

type ExtendedGetRequest = {
  query: GetRemarksQuery;
};

type ExtendedGetResponse = {
  json: (body: GetRemarksData) => void;
};

export type PostRemarksBody = RemarkRequest;

export type PostRemarksData = RemarkListResponse;

type ExtendedPostRequest = {
  body: PostRemarksBody;
};

type ExtendedPostResponse = {
  json: (body: PostRemarksData) => void;
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<ExtendedGetResponse | ExtendedPostResponse>
>(options)
  .use(verifyIdTokenMiddleware)
  .get<ExtendedGetRequest, ExtendedGetResponse>(async ({ query }, res) => {
    const { data: remarks } = await strapi.get<
      GetRemarksData,
      AxiosResponse<GetRemarksData>
    >(
      stringifyUrl({
        query,
        url: "/api/remarks",
      })
    );

    res.status(200);
    res.json(remarks);
    res.end();
  })
  .post<ExtendedPostRequest, ExtendedPostResponse>(async ({ body }, res) => {
    const { data: remarks } = await strapi.post<
      PostRemarksData,
      AxiosResponse<PostRemarksData>,
      PostRemarksBody
    >("/api/remarks", body);

    res.status(200);
    res.json(remarks);
    res.end();
  });

export default handler;
