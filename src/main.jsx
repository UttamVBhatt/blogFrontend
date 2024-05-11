import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import AuthController from "./contexts/AuthProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthController>
      <App />
    </AuthController>
  </React.StrictMode>
);
