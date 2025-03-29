import React, { useState, useEffect } from "react";

const Timer = ({ initialTime = 20, onTimeout }) => {
  const [time, setTime] = useState(initialTime);
  useEffect(() => {
    if (time === 0) {
      if (onTimeout) onTimeout();
      return;
    }
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time, onTimeout]);

  const formatTime = (seconds) => {
    const secs = seconds % 60;
    return `${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-center p-4 text-xl font-bold">
      Time Remaining: {formatTime(time)}
    </div>
  );
};

export default Timer;