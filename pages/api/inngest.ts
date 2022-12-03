import axios, { AxiosError } from 'axios';
import { load } from 'cheerio';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { createScheduledFunction } from 'inngest';
// ./pages/api/inngest.js
import { serve } from 'inngest/next';

import { firestore } from '../../firebase';
import newEpisode from '../../models/newEpisode';
import observedAnime from '../../models/observedAnime';

const job = async () => {
  let status = "Success";

  const sendMessage = async (
    messengerId: string,
    anime: string,
    episode: string,
    episodeNumber: number,
    url: string
  ) => {
    let request_body = {
      recipient: {
        id: messengerId,
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "button",
            text: `New episode #${episodeNumber} ${episode} of ${anime} just came out!`,
            buttons: [
              {
                type: "web_url",
                url: "https://newanime.vercel.app",
                title: "Open app",
                webview_height_ratio: "full",
              },
              {
                type: "web_url",
                url: url,
                title: "Watch now!",
                webview_height_ratio: "full",
              },
            ],
          },
        },
      },
    };

    try {
      await axios.request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        method: "post",
        params: { access_token: process.env.MESSENGER_TOKEN },
        data: request_body,
      });
    } catch (error) {
      const e = error as AxiosError;
      console.log(e.response?.data);
    }
  };

  try {
    const cloudscraper = require("cloudscraper");

    const querySnapshot = await getDocs(
      collection(firestore, "observedAnimeList")
    );

    for (const document of querySnapshot.docs) {
      let { observedAnimeList } = document.data() as {
        observedAnimeList: observedAnime[];
      };

      let messengerIdSnapshot = await getDoc(
        doc(firestore, "messengerId", document.id)
      );

      for (const anime of observedAnimeList) {
        let html = await cloudscraper.get(anime.url);
        const $ = load(html);

        let episodeList = $(".eplister > ul > li > a");

        episodeList.each((i, el) => {
          if (i < episodeList.length - anime.lastSeenEpisode) {
            let title = $(el).find(".epl-title").text();
            let number = episodeList.length - i;
            let url = $(el).attr("href") ?? "";

            anime.episodes = [
              ...anime.episodes,
              {
                title,
                number,
                url,
              } as newEpisode,
            ];

            if (messengerIdSnapshot.exists()) {
              let { id } = messengerIdSnapshot.data();
              if (id) {
                sendMessage(id, anime.name, title, number, url);
              }
            }
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
  createScheduledFunction("Episode Checker", "*/15 * * * *", job),
]);
