import { ConditionRequest, ConditionResponse } from "@taicho/api";
import { AxiosResponse } from "axios";
import options from "libs/options";
import strapi from "libs/strapi";
import verifyIdTokenMiddleware from "libs/verifyIdTokenMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

export type PutConditionsIdBody = ConditionRequest;

export type PutConditionsIdQuery = {
  id: string;
};

export type PutConditionsIdData = ConditionResponse;

type ExtendedPutRequest = {
  body: PutConditionsIdBody;
  query: PutConditionsIdQuery;
};

type ExtendedPutResponse = {
  json: (body: PutConditionsIdData) => void;
};

const handler = nc<NextApiRequest, NextApiResponse<ExtendedPutResponse>>(
  options
)
  .use(verifyIdTokenMiddleware)
  .put<ExtendedPutRequest, ExtendedPutResponse>(
    async ({ body, query: { id } }, res) => {
      const { data: conditions } = await strapi.put<
        PutConditionsIdData,
        AxiosResponse<PutConditionsIdData>,
        PutConditionsIdBody
      >(`/api/conditions/${id}`, body);

      res.status(200);
      res.json(conditions);
      res.end();
    }
  );

export default handler;
