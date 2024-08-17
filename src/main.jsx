import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return (
    <div>
      <h1>Hel World</h1>
    </div>
  );
};

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(<App />);
