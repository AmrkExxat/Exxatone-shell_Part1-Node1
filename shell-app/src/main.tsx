
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";
  // @exxat/ui component styling (stylox). Loaded after the shell's own sheet so
  // the library's tokens and component rules win where the two overlap.
  import "./styles/exxat-ui.scss";

  createRoot(document.getElementById("root")!).render(<App />);

