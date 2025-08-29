import React from "react";
export default function LoadingSpinner1() {
  return (
    <div className="flex items-center w-full justify-center min-h-[300px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-indigo-500"></div>
    </div>
  );
}
