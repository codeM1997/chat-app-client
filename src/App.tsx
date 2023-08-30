import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
type AnyObject = {
  [key: string]: any;
};
let socket: AnyObject;
//https://coolors.co/16697a-489fb5-82c0cc-ede7e3-ffa62b
//https://youtu.be/gC0pNkf7qzU?si=uZBvczzPVQfWKtzG&t=1484
function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [room, setRoom] = useState("");
  useEffect(() => {
    console.log("run");
    socket = io("http://localhost:3001");
    socket.on("welcome", (data: AnyObject) => {
      console.log("welcome daa", data);
    });
    return () => {
      console.log("dismount");
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    socket.on("receive_message", (data: any) => {
      console.log("data", data);
      setMessageList((current: Array<string>): any => {
        const copy: any = [...current];
        copy.push({
          author: data.author,
          message: data.message,
        });
        return copy;
      });
    });
  }, []);

  const connectToRoom = () => {
    socket.emit("join_room", room);
    setIsConnected(true);
  };

  const sendMessage = async () => {
    const messageData = {
      room: room,
      content: {
        message: message,
        author: name,
      },
    };
    await socket.emit("send_message", messageData);
    setMessageList((current: Array<string>): any => {
      const copy: any = [...current];
      copy.push({
        author: name,
        message: message,
        self: true,
      });
      return copy;
    });
    setMessage("");
  };

  return (
    <div className="body-div">
      {isConnected ? (
        <div className="chat-main-div">
          <div className="room-heading">
            Room Name: <strong>{room}</strong>
          </div>
          <div
            style={{
              backgroundColor: "#d5d5cb",
              height: "90%",
              width: "100%",
              borderRadius: "5px",
              overflowY: "auto",
            }}
          >
            {messageList.map((msg: any) => {
              return (
                <div
                  key={msg.message + msg.author}
                  className={msg.self ? "message-to" : "message-from"}
                >
                  <div>{msg.message}</div>
                  <div style={{ fontSize: "10px", fontStyle: "italic" }}>
                    {msg.author}
                  </div>
                </div>
              );
            })}
          </div>
          <div
            style={{
              backgroundColor: "#FFA62B",
              height: "10%",
              width: "100%",
              borderRadius: "5px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <input
              value={message}
              onKeyDown={(e: any) => {
                if (e.keyCode === 13) {
                  sendMessage();
                }
              }}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: "90%" }}
              placeholder="Enter message"
            />
            <button
              onClick={sendMessage}
              style={{ background: "#16697A", color: "white" }}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="loginDiv">
          <h1 style={{ textAlign: "center", color: "#FFA62B", fontFamily: "" }}>
            Enter Chat Room
          </h1>
          <div style={{ display: "flex" }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ padding: "5px", margin: "5px" }}
              name="name"
              placeholder="Enter name"
            />
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              style={{ padding: "5px", margin: "5px" }}
              name="room"
              placeholder="Enter room name"
            />
            <button
              onClick={connectToRoom}
              style={{
                padding: "5px",
                margin: "5px",
                background: "#16697A",
                color: "white",
              }}
            >
              Enter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
