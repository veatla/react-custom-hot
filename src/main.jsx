import { createRoot } from "react-dom/client";
import List from "./List";

const App = () => {
  return (
    <div>
      <h1>Hel World</h1>
      <List />
    </div>
  );
};

const domNode = document.getElementById("root");
const root = createRoot(domNode);

root.render(<App />);