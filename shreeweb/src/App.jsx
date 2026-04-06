import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShreeWebApp from "./shreeweb/shreeweb/ShreeWebApp";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/shreeweb/*" element={<ShreeWebApp />} />
      <Route path="/*" element={<ShreeWebApp />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
