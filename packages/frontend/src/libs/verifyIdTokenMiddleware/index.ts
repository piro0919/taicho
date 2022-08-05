import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { verifyIdToken } from "next-firebase-authentication/dist/verifyIdToken";

async function verifyIdTokenMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
): Promise<void> {
  try {
    await verifyIdToken({ req, res });

    next();
  } catch {
    next(Error("Failed to verify id token"));
  }
}

export default verifyIdTokenMiddleware;
