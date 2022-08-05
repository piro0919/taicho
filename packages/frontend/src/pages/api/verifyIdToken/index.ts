import type { NextApiRequest, NextApiResponse } from "next";
import {
  verifyIdToken,
  VerifyIdToken,
} from "next-firebase-authentication/dist/verifyIdToken";

export type VerifyIdTokenData = VerifyIdToken | Record<string, unknown>;

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyIdTokenData>
): Promise<void> {
  try {
    const data = await verifyIdToken({ req, res });

    res.status(200).json(data);
  } catch {
    res.status(500).json({});
  }
}

export default handler;
