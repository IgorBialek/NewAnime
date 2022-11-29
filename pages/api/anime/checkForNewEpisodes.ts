// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { load } from 'cheerio';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

import { firestore } from '../../../firebase';
import newEpisode from '../../../models/newEpisode';
import observedAnime from '../../../models/observedAnime';

import type { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ status: string }>
) {
  let status = "Success";

  try {
    const cloudscraper = require("cloudscraper");

    const querySnapshot = await getDocs(
      collection(firestore, "observedAnimeList")
    );

    for (const document of querySnapshot.docs) {
      let { observedAnimeList } = document.data() as {
        observedAnimeList: observedAnime[];
      };

      for (const anime of observedAnimeList) {
        let html = await cloudscraper.get(anime.url);
        const $ = load(html);

        let episodeList = $(".eplister > ul > li > a");

        episodeList.each((i, el) => {
          if (i < episodeList.length - anime.lastSeenEpisode) {
            anime.episodes = [
              ...anime.episodes,
              {
                title: $(el).find(".epl-title").text(),
                number: episodeList.length - i,
                link: $(el).attr("href"),
                new: true,
              } as newEpisode,
            ];
          }
        });
      }

      await setDoc(doc(firestore, "observedAnimeList", document.id), {
        observedAnimeList,
      });
    }
  } catch {
    status = "Failure";
  }

  res.status(200).json({ status });
}
