import { FeelingRequest, FeelingResponse } from "@taicho/api";
import { AxiosResponse } from "axios";
import fetchStrapi from "libs/fetchStrapi";
import options from "libs/options";
import verifyIdTokenMiddleware from "libs/verifyIdTokenMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

export type PutFeelingsIdBody = FeelingRequest;

export type PutFeelingsIdQuery = {
  id: string;
};

export type PutFeelingsIdData = FeelingResponse;

type ExtendedPutRequest = {
  body: PutFeelingsIdBody;
  query: PutFeelingsIdQuery;
};

type ExtendedPutResponse = {
  json: (body: PutFeelingsIdData) => void;
};

const handler = nc<NextApiRequest, NextApiResponse<ExtendedPutResponse>>(
  options
)
  .use(verifyIdTokenMiddleware)
  .put<ExtendedPutRequest, ExtendedPutResponse>(
    async ({ body, query: { id } }, res) => {
      const { data: feelings } = await fetchStrapi.put<
        PutFeelingsIdData,
        AxiosResponse<PutFeelingsIdData>,
        PutFeelingsIdBody
      >(`/api/feelings/${id}`, body);

      res.status(200);
      res.json(feelings);
      res.end();
    }
  );

export default handler;
