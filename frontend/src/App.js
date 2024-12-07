import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import MyBookshelfPage from "./components/MyBookshelfPage";
import BookDescription from "./components/BookDescription";
import Logout from "./components/Logout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mybookshelfpage" element={<MyBookshelfPage />} />
        <Route path="/book/:id" element={<BookDescription />} />
      </Routes>
    </Router>
  );
}

export default App;
