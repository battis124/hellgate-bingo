const express = require("express");
const Pusher = require("pusher");
const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const server_port = process.env.SERVER_PORT || 3000;
const server_ip = process.env.SERVER_IP || "127.0.0.1";

let gameRooms = [];

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

//user rqeuest to create room
app.post("/create-game-room", (req, res) => {
  const { roomOwner, roomID, squares } = req.body;
  console.log("roomOwner: " + roomOwner, "| roomId: " + roomID);

  gameRooms[roomID] = {
    roomOwner: roomOwner,
    gameData: squares,
  };

  res.send("ok");
});

//update game data
app.post("/update-game", (req, res) => {
  const { roomOwner, changedByUserID, roomID, squares, resetGame } = req.body;
  gameRooms[roomID].gameData = squares;
  console.log(
    "user: " +
      changedByUserID +
      "resquested to update game data in room: " +
      roomID
  );
  pusher.trigger(roomID, "game-updated", {
    changedByUserID: changedByUserID,
    squares: squares,
    resetGame: resetGame,
  });
  res.send("ok");
});

app.get("/get-game-room", (req, res) => {
  const { userID, roomID } = req.query;

  console.log("user: " + userID + " joined and requested data for: " + roomID);
  // console.log("gameRooms[roomID].roomOwner: ", gameRooms[roomID]);
  if (!gameRooms[roomID]) {
    res.send({ error: "no rooms" });
    return;
  }
  res.send({
    roomOwner: gameRooms[roomID].roomOwner,
    squares: gameRooms[roomID].gameData,
  });
});

app.get("/get-game-rooms", (req, res) => {
  res
    .status(200)
    .send(
      Object.keys(gameRooms).length === 0
        ? "no rooms"
        : Object.keys(gameRooms).length.toString()
    );
  console.log("gameRooms: ", Object.keys(gameRooms).length);
});

app.listen(server_port, () => {
  console.log(`Example app listening at: http://${server_ip}:${server_port}`);
});

pusher.trigger("my-channel", "my-event", {
  message: process.env.NODE_ENV + " Server Started",
});
