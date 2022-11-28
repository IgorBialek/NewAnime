// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { load } from 'cheerio';

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = req.body.url;
  const cloudscraper = require("cloudscraper");

  let html = await cloudscraper.get(url);
  const $ = load(html);

  $(".eplister > ul > li > a").each((i, el) => {
    console.log(i);
  });

  res.status(200).json({ data: html });
}
