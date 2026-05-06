import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

function Home() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1 className="py-6">Hi</h1>
      <div className="flex justify-between items-center">
        <span>Count: {count}</span>
        <button
          onClick={() => {
            setCount((prev) => prev + 1);
          }}
        >
          +
        </button>
      </div>
    </>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
});
