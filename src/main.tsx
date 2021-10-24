import React from "react";
import ReactDOM from "react-dom";
import { AuthProvider } from "./hooks/useAuth";
import { Home } from "./pages/Home";
import "./styles/global.scss";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <Home />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
