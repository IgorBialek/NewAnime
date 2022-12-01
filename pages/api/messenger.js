// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    let { object, entry } = req.body;

    if (object === "page") {
      entry.forEach(async function (entry) {
        let webhook_event = entry.messaging[0];
        let sender_psid = webhook_event.sender.id;

        if (webhook_event.message.text) {
          let request_body = {
            recipient: {
              id: sender_psid,
            },
            message: { text: sender_psid },
          };

          try {
            await axios.request({
              url: "https://graph.facebook.com/v2.6/me/messages",
              method: "post",
              params: { access_token: process.env.MESSENGER_TOKEN },
              data: request_body,
            });
          } catch (e) {
            console.log(e.response.data.error);
          }
        }
        res.status(200).send("EVENT_RECEIVED");
      });
    } else {
      res.sendStatus(404);
    }
  }

  if (req.method === "GET") {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (
        mode === "subscribe" &&
        token === process.env.MESSENGER_VERIFY_TOKEN
      ) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  }
}
