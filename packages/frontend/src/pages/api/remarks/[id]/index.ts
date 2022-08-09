import { RemarkRequest, RemarkResponse } from "@taicho/api";
import { AxiosResponse } from "axios";
import options from "libs/options";
import strapi from "libs/strapi";
import verifyIdTokenMiddleware from "libs/verifyIdTokenMiddleware";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

export type DeleteRemarksIdQuery = {
  id: string;
};

export type DeleteRemarksIdData = RemarkResponse;

type ExtendedDeleteRequest = {
  query: DeleteRemarksIdQuery;
};

type ExtendedDeleteResponse = {
  json: (body: DeleteRemarksIdData) => void;
};

export type PutRemarksIdBody = RemarkRequest;

export type PutRemarksIdQuery = {
  id: string;
};

export type PutRemarksIdData = RemarkResponse;

type ExtendedPutRequest = {
  body: PutRemarksIdBody;
  query: PutRemarksIdQuery;
};

type ExtendedPutResponse = {
  json: (body: PutRemarksIdData) => void;
};

const handler = nc<
  NextApiRequest,
  NextApiResponse<ExtendedDeleteResponse | ExtendedPutResponse>
>(options)
  .use(verifyIdTokenMiddleware)
  .delete<ExtendedDeleteRequest, ExtendedDeleteResponse>(
    async ({ query: { id } }, res) => {
      const { data: remarks } = await strapi.delete<
        DeleteRemarksIdData,
        AxiosResponse<DeleteRemarksIdData>
      >(`/api/remarks/${id}`);

      res.status(200);
      res.json(remarks);
      res.end();
    }
  )
  .put<ExtendedPutRequest, ExtendedPutResponse>(
    async ({ body, query: { id } }, res) => {
      const { data: remarks } = await strapi.put<
        PutRemarksIdData,
        AxiosResponse<PutRemarksIdData>,
        PutRemarksIdBody
      >(`/api/remarks/${id}`, body);

      res.status(200);
      res.json(remarks);
      res.end();
    }
  );

export default handler;
