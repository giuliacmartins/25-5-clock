import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const beepRef = useRef(null);

  const formatTime = (time) => {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!isRunning) return;

    if (timeLeft === 0) {
      if (beepRef.current) {
        beepRef.current.play();
      }

      setTimeout(() => {
        setIsSession((prev) => !prev);
        setTimeLeft(isSession ? breakLength * 60 : sessionLength * 60);
      }, 1000);

      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isSession, breakLength, sessionLength]);

  const handleSessionChange = (amount) => {
    const newSession = Math.max(1, Math.min(60, sessionLength + amount));
    setSessionLength(newSession);
    if (isSession && !isRunning) {
      setTimeLeft(newSession * 60);
    }
  };

  const handleBreakChange = (amount) => {
    setBreakLength((prev) => Math.max(1, Math.min(60, prev + amount)));
  };

  const handleReset = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  return (
    <div className="container text-center">
      <h1>Pomodoro Clock</h1>
      <div className="row">
        <div className="col">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => handleBreakChange(-1)}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => handleBreakChange(1)}>
            +
          </button>
        </div>
        <div className="col">
          <h2 id="session-label">Session Length</h2>
          <button
            id="session-decrement"
            onClick={() => handleSessionChange(-1)}
          >
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => handleSessionChange(1)}>
            +
          </button>
        </div>
      </div>
      <h2 id="timer-label">{isSession ? "Session" : "Break"}</h2>
      <h3 id="time-left">{formatTime(timeLeft)}</h3>
      <button id="start_stop" onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? "Pause" : "Start"}
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>
      <audio
        id="beep"
        ref={beepRef}
        src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        preload="auto"
      ></audio>
    </div>
  );
}

export default App;
