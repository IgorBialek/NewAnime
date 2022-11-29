import { load } from 'cheerio';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { createScheduledFunction } from 'inngest';
// ./pages/api/inngest.js
import { serve } from 'inngest/next';

import { firestore } from '../../firebase';
import newEpisode from '../../models/newEpisode';
import observedAnime from '../../models/observedAnime';

const job = async () => {
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
                url: $(el).attr("href"),
              } as newEpisode,
            ];
          }
        });

        anime.lastSeenEpisode = episodeList.length;
      }

      await setDoc(doc(firestore, "observedAnimeList", document.id), {
        observedAnimeList,
      });
    }
  } catch {
    status = "Failure";
  }

  return status;
};

export default serve("NewAnime", [
  createScheduledFunction("Episode Checker", "*/5 * * * *", job),
]);
