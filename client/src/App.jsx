import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import axios from "axios";
import Board from "./components/Board";
import { wordsList } from "./resources/wordsList";
import soundFile1 from "./resources/trudne-wylosowało.mp3";
import soundFile2 from "./resources/losu-losu.mp3";
import { ShareIcon } from "./components/icons/ShareIcon";
import { RollIcon } from "./components/icons/RollIcon";
import { LeaveIcon } from "./components/icons/LeaveIcon";
import { CopyIcon } from "./components/icons/CopyIcon";

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
  const [hasBeenInvited, setHasBeenInvited] = useState(false);
  const [userID, setUserID] = useState("");
  const [pusherAPI, setPusherAPI] = useState(null);
  const [roomLink, setRoomLink] = useState("");
  const [linkCopiedNotification, setLinkCopiedNotification] = useState(false);

  const [onlineGame, setonlineGame] = useState({
    status: "OFFLINE",
    roomID: undefined,
    roomOwner: undefined,
  });

  const [squares, setSquares] = useState(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      value: `${i + 1}`,
      isChecked: false,
      isWinningBox: false,
    }))
  );

  useEffect(() => {
    //check if any parameter in url
    const urlParams = new URLSearchParams(window.location.search);
    const isInviteLink = urlParams.get("isInviteLink");
    const roomID = urlParams.get("roomID");

    //clear url parameters

    console.log("isInviteLink: ", isInviteLink, "roomID: ", roomID);
    if (isInviteLink && roomID) {
      userJoinedOnlineGame(isInviteLink, roomID);
    }

    return () => {
      //cleanup
    };
  }, []);

  useEffect(() => {
    console.log("use invoked");
    const pusher = initPusher();
    if (onlineGame.status === "ONLINE") {
      setRoomLink(
        window.location.origin +
          "?isInviteLink=true&roomID=" +
          onlineGame.roomID
      );
      const channel = pusher.subscribe(onlineGame.roomID);
      channel.bind("game-updated", (data) => {
        console.log("remote data recived:", data);
        if (data.changedByUserID === userID) return;
        if (data.resetGame === true) setGameStatus(true);

        setSquares(data.squares);
      });
    }
    return () => {
      console.log("unsubscribing from pusher", onlineGame.roomID);
      pusher.unsubscribe(onlineGame.roomID);
    };
  }, [onlineGame]);

  function initGameSettings() {}
  function initPusher() {
    if (pusherAPI !== null) return pusherAPI;
    var pusher = new Pusher(process.env.REACT_APP_PUSHER_KEY, {
      cluster: "eu",
      encrypted: true,
    });
    setPusherAPI(pusher);
    return pusher;
  }

  function userJoinedOnlineGame(isInviteLink, roomID) {
    console.log("isInviteLink: ", isInviteLink, "roomID: ", roomID);
    const userID = "user-" + Math.random().toString(36).substr(2, 25);
    setHasBeenInvited(true);
    setGameStatus(true);
    setUserID(userID);

    axios
      .get(
        `${process.env.REACT_APP_SERVER_URL}/get-game-room?roomID=${roomID}&userID=${userID}`
      )
      .then(function (response) {
        console.log(response);
        if (response.data.error) {
          console.log("no room");
          // handleResetGameClick();
          setonlineGame({
            status: "OFFLINE",
            roomID: undefined,
            roomOwner: undefined,
          });
          setHasBeenInvited(false);
          return;
        }
        setonlineGame({
          status: "ONLINE",
          roomID: roomID,
          roomOwner: response.data.roomOwner,
        });
        setSquares(response.data.squares);
      });
  }

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
    sendUpdatedSquaresToServer(newSquares, true);
  }

  function sendUpdatedSquaresToServer(newSquares, resetGame = false) {
    // console.log("sending data to serv");
    if (onlineGame.status === "ONLINE") {
      axios
        .post(process.env.REACT_APP_SERVER_URL + "/update-game", {
          roomOwner: onlineGame.roomOwner,
          changedByUserID: userID,
          roomID: onlineGame.roomID,
          squares: newSquares,
          resetGame: resetGame,
        })
        .catch((error) => {
          setonlineGame({
            status: "OFFLINE",
            roomID: undefined,
            roomOwner: undefined,
          });
        });
    }
  }

  function handleExitGame() {
    window.history.replaceState({}, document.title, "/");
    console.log("exit game");
    setonlineGame({
      status: "OFFLINE",
      roomID: undefined,
      roomOwner: undefined,
    });
    setGameStatus(true);
    setHasBeenInvited(false);

    // handleResetGameClick();
    // todo - send message to server to delete room
    // todo - set game to 0
  }
  function handleStartOnlineSession() {
    const userID = "user-" + Math.random().toString(36).substr(2, 25);
    const roomID = "room-" + Math.random().toString(36).substr(2, 25);
    setUserID(userID);

    setonlineGame({
      status: "ONLINE",
      roomID: roomID,
    });
    axios
      .post(process.env.REACT_APP_SERVER_URL + "/create-game-room", {
        roomOwner: userID,
        roomID: roomID,
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
          sendUpdatedSquaresToServer={sendUpdatedSquaresToServer}
        />
        <div className="container mx-auto  py-3 text-center md:h-1/5">
          {onlineGame.status === "ONLINE" && (
            <>
              <div className="relative mb-5">
                <button
                  onClick={() => {
                    setLinkCopiedNotification(true);
                    setTimeout(() => {
                      setLinkCopiedNotification(false);
                    }, 1500);
                    navigator.clipboard.writeText(roomLink);
                  }}
                  className=" center w-100 mx-auto block rounded-lg bg-slate-300  text-slate-900 underline"
                  href={roomLink}
                >
                  <span className=" px-4 py-2">{roomLink}</span>

                  <span className="inline-flex items-center rounded-r-md bg-blue-600 p-3 text-slate-100">
                    Copy <CopyIcon className="inline-block pl-1" />
                  </span>
                </button>
                <div
                  className={
                    (linkCopiedNotification ? " opacity-100" : " opacity-0") +
                    " absolute left-[50%] right-[50%] top-[50%] z-0 mx-auto mt-4 w-[300px] translate-x-[-50%] translate-y-[-50%] rounded-full bg-green-500 p-2 text-white transition duration-300"
                  }
                >
                  Link copied to clipboard!
                </div>
              </div>
            </>
          )}

          {hasBeenInvited !== true && (
            <button
              onClick={handleResetGameClick}
              className="mx-2 inline-flex rounded-full bg-blue-600 px-16 py-4 text-sm font-bold text-white transition hover:bg-blue-500 md:text-base"
            >
              Losuj <RollIcon className="inline-block pl-2" />
            </button>
          )}

          {onlineGame.status === "OFFLINE" && (
            <button
              onClick={handleStartOnlineSession}
              className="mx-2 inline-flex rounded-full bg-green-600 px-16 py-4 text-sm font-bold text-white transition hover:bg-green-500 md:text-base"
            >
              Zaproś do gry <ShareIcon className="inline-block pl-2" />
            </button>
          )}

          {onlineGame.status === "ONLINE" && (
            <>
              <button
                onClick={handleExitGame}
                className="inline-flex rounded-full bg-red-600 px-16 py-4 text-sm font-bold text-white transition hover:bg-red-500 md:text-base"
              >
                Zakończ <LeaveIcon className="inline-block pl-2" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* <div className="p-r-4 p-b-4 absolute bottom-2 left-2 block text-sm text-slate-500">
        userid: {userID} | room: {onlineGame.roomID} | {onlineGame.status}
      </div> */}

      <div className="p-r-4 p-b-4 absolute bottom-2 right-2 block text-sm text-slate-500">
        ver:04.06.2023 | hasła: {wordsList.length}{" "}
      </div>
    </>
  );
}

export default App;
