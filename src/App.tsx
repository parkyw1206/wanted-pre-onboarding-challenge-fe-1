import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TodoPage from "./Pages/Todo";
import AuthPage from "./Pages/Auth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/todo" element={<TodoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
