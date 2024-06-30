import { useState, useEffect, useRef } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaPause,
  FaStop,
} from "react-icons/fa";

function App() {
  const [timeLeft, setTimeLeft] = useState(1500);
  const [clockStatus, setClockStatus] = useState(false);
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);
  const [mode, setMode] = useState("Session");
  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (clockStatus) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime === 0) {
              if (audioRef.current) audioRef.current.play();
              if (mode === "Session") {
                setMode("Break");
                return breakLength * 60;
              } else {
                setMode("Session");
                return sessionLength * 60;
              }
            } else {
              return prevTime - 1;
            }
          });
        }, 1000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [clockStatus, mode, breakLength, sessionLength]);

  const handleSessionLength = (type) => {
    if (clockStatus) {
      return;
    }
    setClockStatus(false);
    setSessionLength((prevLength) => {
      let newSession;
      if (type === "increment" && prevLength < 60) {
        newSession = prevLength + 1;
      } else if (type === "decrement" && prevLength > 1) {
        newSession = prevLength - 1;
      } else {
        return prevLength;
      }
      if (mode === "Session") {
        setTimeLeft(newSession * 60);
      }
      return newSession;
    });
  };

  const handleBreakLength = (type) => {
    if (clockStatus) {
      return;
    }

    setBreakLength((prevLength) => {
      let newBreak;
      if (type === "increment" && prevLength < 60) {
        newBreak = prevLength + 1;
      } else if (type === "decrement" && prevLength > 1) {
        newBreak = prevLength - 1;
      } else {
        return prevLength;
      }

      if (mode === "Break") {
        setTimeLeft(newBreak * 60);
      }

      return newBreak;
    });
  };

  const calculateTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleStartStop = () => {
    setClockStatus((prevStatus) => !prevStatus);
  };

  const handleReset = () => {
    setTimeLeft(1500);
    setClockStatus(false);
    setMode("Session");
    setSessionLength(25);
    setBreakLength(5);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <div id="wrapper">
        <div id="clock-container">
          <h1 className="main-heading">25+5 Clock</h1>
          <div className="input-container">
            <div id="break-label">
              <h4 className="label-heading">Break Length</h4>
              <div className="input">
                <span
                  id="break-increment"
                  onClick={() => handleBreakLength("increment")}
                >
                  <FaArrowUp style={{ color: "green" }} />
                </span>
                <p id="break-length">{breakLength}</p>
                <span
                  id="break-decrement"
                  onClick={() => handleBreakLength("decrement")}
                >
                  <FaArrowDown style={{ color: "red" }} />
                </span>
              </div>
            </div>
            <div id="session-label">
              <h4 className="label-heading">Session Length</h4>
              <div className="input">
                <span
                  id="session-increment"
                  onClick={() => handleSessionLength("increment")}
                >
                  <FaArrowUp style={{ color: "green" }} />
                </span>
                <p id="session-length">{sessionLength}</p>
                <span
                  id="session-decrement"
                  onClick={() => handleSessionLength("decrement")}
                >
                  <FaArrowDown style={{ color: "red" }} />
                </span>
              </div>
            </div>
          </div>
          <div id="timer-label">
            <h4
              className="session-heading"
              style={{ color: mode === "Session" ? "#e7219f" : "#f9ff00" }}
            >
              {mode}
            </h4>
            <div className="output">
              <p
                id="time-left"
                style={{ color: timeLeft < 60 ? "#d72222" : "#3cd36c" }}
              >
                {calculateTime(timeLeft)}
              </p>
              <audio
                id="beep"
                ref={audioRef}
                src="../src/assets/media/bell-ring.mp3"
              ></audio>
            </div>
          </div>
          <div id="button-container">
            <button id="start_stop" onClick={handleStartStop}>
              {!clockStatus ? <FaPlay /> : <FaPause />}
            </button>
            <button id="reset" onClick={handleReset}>
              <FaStop />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
