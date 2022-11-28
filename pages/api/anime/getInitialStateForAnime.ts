// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { load } from 'cheerio';

import observedAnime from '../../../models/observedAnime';

import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<observedAnime>
) {
  const url = req.body.url;
  const cloudscraper = require("cloudscraper");

  let html = await cloudscraper.get(url);
  const $ = load(html);

  let anime: observedAnime = {
    name: $(".entry-title").text(),
    image:
      $(
        "div.bixbox.animefull > div.bigcontent > div.thumbook > div.thumb > img"
      ).attr("src") ?? "",
    lastSeenEpisode: $(".eplister > ul > li > a").length,
    url,
  };

  res.status(200).json(anime);
}
