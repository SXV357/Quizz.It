import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SummarySelection from "./SummarySelection";
import QGenerationSelection from "./QGenerationSelection";
import QAnsweringSelection from "./QAnsweringSelection";
import SummaryPage from "./SummaryPage";
import SignUp from "./SignUp";
import Login from "./Login";
import Landing from "./Landing";
import ForgotPassword from "./ForgotPassword";
import Chatbot from "./Chatbot";

const root = ReactDOM.createRoot(document.getElementById("root"));

const routes = [
  { path: "/", component: <Landing /> },
  { path: "/sign_up", component: <SignUp /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot_password", component: <ForgotPassword /> },
  { path: "/app", component: <App /> },
  { path: "/fetch_summarize_files", component: <SummarySelection /> },
  { path: "/summary_page", component: <SummaryPage /> },
  { path: "/fetch_questions_files", component: <QGenerationSelection /> },
  { path: "/fetch_ask_questions_files", component: <QAnsweringSelection /> },
  { path: "/chatbot_page", component: <Chatbot /> },
];

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {routes.map((route, idx) => {
          return (
            <Route
              key={idx}
              exact
              path={route.path}
              element={route.component}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
