import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import authRouter from "./routes/auth";
import conversationRouter from "./routes/conversation";
import messageRouter from "./routes/message";
import saveMsgToDb from "./controllers/messag3e/send";

const app: Express = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"],
  },
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    exposedHeaders: ["x-auth-token", "auth-token"],
  })
);
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/conversation", conversationRouter);
app.use("/message", messageRouter);

interface Data {
  message: string;
  conversationId: string;
  userName: string;
  userId: string;
}

io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("join_conversation", (data) => {
    socket.join(data);
  });

  socket.on("send_message", async (data: Data) => {
    console.log("data", data);
    io.to(data.conversationId).emit("receive_message", data);
    await saveMsgToDb({
      content: data.message,
      conversationId: data.conversationId,
      memberId: data.userId,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(8000, () => {
  console.log("App running🚀");
});
