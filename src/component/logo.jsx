import React from "react";

export const logo = () => {
  return (
    <div>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="48" fill="black" />
        <text
          x="50%"
          y="55%"
          dominant-baseline="middle"
          text-anchor="middle"
          font-family="Arial, sans-serif"
          font-size="48"
          fill="white"
        >
          A
        </text>
      </svg>
    </div>
  );
};
