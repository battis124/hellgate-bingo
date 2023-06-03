const express = require("express");
const Pusher = require("pusher");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const server_port = process.env.SERVER_PORT || 3000;
const server_ip = process.env.SERVER_IP || "127.0.0.1";

let channels = ["my-channel"];

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});

app.listen(server_port, () => {
  console.log(`Example app listening at: http://${server_ip}:${server_port}`);
});

pusher.trigger("my-channel", "my-event", {
  message: process.env.NODE_ENV + " Server Started",
});

app.get("/create-room", (req, res) => {
  console.log("uesr requested to create room");
  (async () => {
    const attributes = "subscription_count,user_count";
    const res = await pusher
      .trigger(
        channels,
        "my-event",
        {
          message: "hello world",
        },
        {
          info: attributes,
        }
      )
      .catch((err) => {
        console.log(err);
      });

    if (res.status === 200) {
      const body = await res.json();
      const channelsInfo = body.channels;
    }
  })();
});
