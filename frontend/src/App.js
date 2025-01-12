import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";
import MyBookshelfPage from "./components/MyBookshelfPage";
import BookDescription from "./components/BookDescription";
import Logout from "./components/Logout";
import ReviewPage1 from "./components/ReviewPage1";
import Friends from "./components/friends";

function App() {
  const userId = localStorage.getItem("userId");
  console.log("User id in App.js(route) frontend", userId);
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
        <Route path="/review1/:bookId" element={<ReviewPage1 />} />
        <Route path="/friends" element={<Friends />} />
      </Routes>
    </Router>
  );
}

export default App;
