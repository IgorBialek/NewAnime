import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ status: string }>
) {
  let status = "Success";

  res.status(200).json({ status });
}