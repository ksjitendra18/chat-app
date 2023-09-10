import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Conversation from "./pages/Conversation";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="chat" element={<Chat />} />
          <Route
            path="conversation/:conversationId"
            element={<Conversation io={socket} />}
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
