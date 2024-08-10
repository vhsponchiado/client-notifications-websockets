import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Typography } from "@mui/material";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const socket = io("http://localhost:3000");

interface Notification {
  author: string;
  message: string;
  figure: string;
  timestamp: string;
  type: string;
}

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    socket.on("receiveNotification", (data: Notification) => {
      setNotifications((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveNotification");
    };
  }, []);

  function removeNotification(index: number) {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-5 bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="w-[400px] h-[640px] bg-[#121212] rounded-3xl shadow-2xl flex flex-col items-center overflow-hidden">
        <div className="min-h-[64px] w-full shadow-md bg-zinc-900 rounded-t-xl flex items-center justify-center">
          <h1 className="font-medium text-xl text-white flex items-center">
            <NotificationsActiveIcon style={{ marginRight: 8 }} />
            Notifications
          </h1>
        </div>
        <div className="w-full h-full flex flex-col items-center overflow-auto">
          {notifications.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="flex flex-col items-center justify-center">
                <div className="text-[#888]">
                  <NotificationsNoneIcon style={{ fontSize: 60 }} />
                </div>
                <Typography variant="h6" style={{ color: "#888" }}>
                  No notifications
                </Typography>
              </div>
            </div>
          ) : (
            <div className="w-full h-full px-5 py-5 flex flex-col gap-4 overflow-y-auto">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="w-full group bg-gradient-to-r from-zinc-900 to-zinc-800 flex gap-4 items-center px-2 min-h-[64px] rounded-xl relative"
                >
                  <img
                    src={notification.figure}
                    alt="thumbnail"
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <span className="font-medium text-white text-sm">
                      {notification.author}
                    </span>
                    <p className="leading-relaxed text-gray-300 text-xs">
                      {notification.message}
                    </p>
                  </div>
                  <div className="absolute right-0 top-0 h-full flex items-center">
                    <div
                      className="bg-zinc-900 text-zinc-400 hover:text-zinc-700 h-full w-8 flex items-center justify-center rounded-r-xl cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-500"
                      onClick={() => removeNotification(index)}
                    >
                      <DeleteForeverIcon fontSize="small" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="min-h-[48px] w-full shadow-md bg-zinc-900 rounded-b-xl flex items-center justify-center">
            <span className="text-zinc-600 text-xs font-medium">Made by Vinícius H.Sponchiado</span>
        </div>
      </div>
    </main>
  );
};

export default App;
