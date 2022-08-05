import { NextApiRequest, NextApiResponse } from "next";
import { Options } from "next-connect";

const options: Options<NextApiRequest, NextApiResponse> = {
  onError: (err, _, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
};

export default options;
