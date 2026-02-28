import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  socket,
  connectSocket,
  disconnectSocket,
} from "../socket/socket";
import { getUser, logout } from "../utils/auth";

export default function Chat() {
  const user = getUser();
  const navigate = useNavigate();
  const scrollRef = useRef();

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  // ✅ Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // ✅ Connect socket once
  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  // ✅ Listen messages
  useEffect(() => {
    const handleMessage = (msg) => {
      if (!selectedUser) return;

      if (
        msg.senderId === selectedUser._id ||
        msg.receiverId === selectedUser._id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [selectedUser]);

  // ✅ Logout
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err);
    } finally {
      logout();
      disconnectSocket();
      navigate("/login");
    }
  };

  // ✅ Search users
  const searchUsers = async (q) => {
    setSearch(q);

    if (!q) {
      setUsers([]);
      return;
    }

    try {
      const res = await api.get(`/users/search?q=${q}`);
      setUsers(res.data);
    } catch (err) {
      console.error("Search failed", err);
    }
  };

  // ✅ Open chat
  const openChat = async (u) => {
    setSelectedUser(u);

    try {
      const res = await api.get(`/messages/${u._id}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Message load failed");
    }
  };

  // ✅ Send message (instant UI)
  const sendMessage = (e) => {
    e.preventDefault();

    if (!text.trim() || !selectedUser) return;

    const newMessage = {
      senderId: user.id,
      receiverId: selectedUser._id,
      message: text,
    };

    // instant update
    setMessages((prev) => [...prev, newMessage]);

    socket.emit("send_message", newMessage);

    setText("");
  };

  return (
    <div className="h-screen flex bg-gray-950 text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="w-80 bg-gray-900 flex flex-col border-r border-gray-800">
        <div className="p-4 border-b border-gray-800 flex justify-between">
          <h1 className="font-bold text-xl">Messages</h1>

          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-red-400"
          >
            Logout
          </button>
        </div>

        <div className="p-4">
          <input
            className="w-full bg-gray-800 rounded-lg px-4 py-2"
            placeholder="Search users..."
            value={search}
            onChange={(e) =>
              searchUsers(e.target.value)
            }
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2">
          {users.map((u) => (
            <div
              key={u._id}
              onClick={() => openChat(u)}
              className={`p-3 rounded-xl cursor-pointer mb-1 ${
                selectedUser?._id === u._id
                  ? "bg-blue-600"
                  : "hover:bg-gray-800"
              }`}
            >
              @{u.username}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-800">
              <h2 className="font-semibold">
                @{selectedUser.username}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={m._id || i}
                  className={`flex ${
                    m.senderId === user.id
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                      m.senderId === user.id
                        ? "bg-blue-600"
                        : "bg-gray-800"
                    }`}
                  >
                    {m.message}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={sendMessage}
              className="p-4 border-t border-gray-800"
            >
              <div className="flex gap-3">
                <input
                  className="flex-1 bg-gray-800 rounded-full px-6 py-3"
                  value={text}
                  onChange={(e) =>
                    setText(e.target.value)
                  }
                  placeholder="Write a message..."
                />

                <button className="bg-blue-600 px-6 rounded-full">
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}