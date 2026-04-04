import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import ShreeWebApp from "./shreeweb/ShreeWebApp";

function AppRoutes() {
  const location = useLocation();

  // Optional: check if current path starts with /shreeweb
  const isShreeWeb = location.pathname.startsWith("/shreeweb");

  return (
    <>
      {/* You can conditionally render something based on route */}
      {isShreeWeb && <div>Inside ShreeWeb Module</div>}

      <Routes>
        <Route path="/shreeweb/*" element={<ShreeWebApp />} />

        {/* other routes */}
        <Route path="/" element={<h1>Home Page</h1>} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}