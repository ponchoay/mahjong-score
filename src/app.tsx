import { BrowserRouter, Route, Routes } from "react-router";
import { LoginPage } from "./pages/loginPage.tsx";
import { ScorePage } from "./pages/scorePage.tsx";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ScorePage />} />
      </Routes>
    </BrowserRouter>
  );
}
