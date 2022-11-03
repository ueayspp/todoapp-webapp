import "./App.css";
import { Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import Main from "./components/Main";
import Credit from "./components/Credit";
import SignOut from "./components/SignOut";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/main" element={<Main />} />
      <Route path="/credit" element={<Credit />} />
      <Route path="/signout" element={<SignOut />} />
    </Routes>
  );
}

export default App;
