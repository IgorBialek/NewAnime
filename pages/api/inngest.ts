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

  const processData = async () => {
    try {
      const cloudscraper = require("cloudscraper");

      console.time("Getting Anime Document");
      const querySnapshot = await getDocs(
        collection(firestore, "observedAnimeList")
      );
      console.timeEnd("Getting Anime Document");

      console.time("Iterating Through Users");
      for (const document of querySnapshot.docs) {
        console.time("Getting User Data");
        let { observedAnimeList } = document.data() as {
          observedAnimeList: observedAnime[];
        };
        console.timeEnd("Getting User Data");

        console.time("Getting User Messenger Id");
        let messengerIdSnapshot = await getDoc(
          doc(firestore, "messengerId", document.id)
        );
        console.timeEnd("Getting User Messenger Id");

        console.time("Iterating Through Animes");
        for (const anime of observedAnimeList) {
          console.time("Getting page");
          let html = await cloudscraper.get(anime.url);
          console.timeEnd("Getting page");

          console.time("Loading HTML");
          const $ = load(html);
          console.timeEnd("Loading HTML");

          console.time("Iterating Though Episodes");
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
                  console.time("Sending Message");
                  sendMessage(id, anime.name, title, number, url);
                  console.timeEnd("Sending Message");
                }
              }
            }
          });

          console.timeEnd("Iterating Though Episodes");

          anime.lastSeenEpisode = episodeList.length;
        }
        console.timeEnd("Iterating Through Animes");

        console.time("Updating DB");
        await setDoc(doc(firestore, "observedAnimeList", document.id), {
          observedAnimeList,
        });
        console.timeEnd("Updating DB");
      }
      console.timeEnd("Iterating Through Users");
    } catch {
      status = "Failure";
    }
  };

  await processData();

  return status;
};

export default serve("NewAnime", [
  createScheduledFunction("Episode Checker", "*/15 * * * *", job),
]);
