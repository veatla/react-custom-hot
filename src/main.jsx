import React from "react";
import { createRoot } from "react-dom/client";

const element = document.getElementById("root");
console.log(element)

const App = () => {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};
const domNode = document.getElementById('root');
const root = createRoot(domNode);

root.render(<App />)