import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import Board from "./components/Board";
import { wordsList } from "./resources/wordsList";
import soundFile1 from "./resources/trudne-wylosowało.mp3";
import soundFile2 from "./resources/losu-losu.mp3";

const audio = [new Audio(soundFile1), new Audio(soundFile2)];
audio.map((sound) => {
  return (sound.volume = 0.2);
});

function playRandomizationSound() {
  var maximum = 1;
  var minimum = 0;
  var randomnumber =
    Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  audio[randomnumber].play();
}

function App() {
  const [gameStatus, setGameStatus] = useState(false);
  const [onlineGame, setonlineGame] = useState({
    status: "OFFLINE",
    roomId: undefined,
    roomOwner: undefined,
  });
  const [userID, setUserID] = useState("");

  const [squares, setSquares] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      value: `${i + 1}`,
      isChecked: false,
      isWinningBox: false,
    }))
  );

  useEffect(() => {
    if (onlineGame.status === "ONLINE") {
      var pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
        cluster: "eu",
        encrypted: true,
        // userAuthentication: {
        //   endpoint: process.env.REACT_APP_SERVER_URL + "/pusher/user-auth",
        // },
      });

      const channel = pusher.subscribe(onlineGame.roomId);
      channel.bind("my-event", (data) => {
        console.log(data);
      });
      channel.trigger("client-my-event", { message: "Hello, Pusher!" });
      return () => {
        pusher.unsubscribe(onlineGame.roomId);
      };
    }
  }, [onlineGame]);

  function handleResetGameClick() {
    setGameStatus(true);
    console.log("losu losu losu");
    playRandomizationSound();
    let wordsBank = [...wordsList];

    const newSquares = squares.map((square) => {
      if (square.id === 12)
        return {
          ...square,
          isChecked: true,
          isWinningBox: false,
          value: "(BINGO)\nQuazars nie do pokonania",
        };
      const index = Math.floor(Math.random() * wordsBank.length);
      const word = wordsBank[index];
      wordsBank.splice(index, 1);
      return { ...square, isChecked: false, isWinningBox: false, value: word };
    });

    setSquares(newSquares);
  }

  function handleStartOnlineSession() {
    const userID = "user-" + Math.random().toString(36).substr(2, 25);
    const roomID = "room-" + Math.random().toString(36).substr(2, 25);
    setUserID(userID);
    setonlineGame({
      status: "ONLINE",
      roomId: roomID,
    });
    axios
      .post(process.env.REACT_APP_SERVER_URL + "/create-game-room", {
        roomOwner: userID,
        roomId: roomID,
        squares: squares,
      })
      .then(function (response) {
        console.log(response);
      });
    console.log("online mode");
  }

  return (
    <>
      <div className="flex h-screen columns-1 flex-col">
        <Board
          squares={squares}
          setSquares={setSquares}
          gameStatus={gameStatus}
          setGameStatus={setGameStatus}
        />
        <div className="container mx-auto py-8 text-center md:h-1/5">
          <button
            onClick={handleResetGameClick}
            className="rounded-full bg-blue-600 px-16 py-4 text-sm font-bold text-white transition hover:bg-blue-500 md:text-base"
          >
            Losuj !
          </button>
          {onlineGame.status === "OFFLINE" && (
            <button
              onClick={handleStartOnlineSession}
              className="rounded-full bg-blue-600 px-16 py-4 text-sm font-bold text-white transition hover:bg-blue-500 md:text-base"
            >
              Zaproś do gry!
            </button>
          )}
          {onlineGame.status === "ONLINE" && (
            <button
              onClick={handleStartOnlineSession}
              className="rounded-full bg-red-600 px-16 py-4 text-sm font-bold text-white transition hover:bg-red-500 md:text-base"
            >
              Zakończ
            </button>
          )}
        </div>
      </div>
      {onlineGame.status === "ONLINE" && (
        <div className="p-r-4 p-b-4 absolute bottom-2 left-2 block text-sm text-slate-500">
          userid: {userID} | room: {onlineGame.roomId}
        </div>
      )}
      <div className="p-r-4 p-b-4 absolute bottom-2 right-2 block text-sm text-slate-500">
        ver:22.04.2023 | hasła: {wordsList.length}{" "}
      </div>
    </>
  );
}

export default App;
