import express from "express";
import { config } from "dotenv";
config();
import mongoose from "mongoose";
import cors from "cors";
import OpenAI from "openai";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { User } from "./model/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Conversation } from "./model/conversation.js";
import { auth } from "./auth.js";
import { log } from "console";

const app = express();
const PORT = process.env.PORT || 8080;

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
});

const server = createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: 3000,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("request", (req) => {
    async function OpenAITextCompletion() {
      console.log("Question received!");
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: req.message }],
        model: "gpt-3.5-turbo",
      });
      console.log("Replied!");
      const reply = completion.choices[0].message.content;
      socket.emit("reply", reply);
      console.log(req.user);
      var newConversation = await Conversation.create({
        userId: req.userId,
        message: req.message,
        reply: reply,
      }).catch((error) => {
        console.error("Error saving conversation in db:", error);
      });
      console.log(newConversation);
    }
    OpenAITextCompletion();
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});

app.use(express.json());
app.use(cors({ origin: true }));

mongoose
  .connect(process.env.MONGO_KEY)
  .then(() => {
    console.log("Connected to database...");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/api/login", async (req, res) => {
  try {
    const data = req.body;
    const { email, password } = data;

    var user = await User.findOne({ email });
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }

    if (user === null) {
      var encryptedPassword = await bcrypt.hash(password, 10);

      user = await User.create({
        email: email.toLowerCase(),
        password: encryptedPassword,
      }).catch((error) => {
        console.error("Error saving user in db:", error);
      });
    }

    console.log("user " + user);
    const id = user._id;
    console.log(id);

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ email, id }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });

      user.token = token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      return res.status(200).json({
        email: user.email,
        _id: user._id,
        token: user.token,
      });
    } else {
      return res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("err");
  }
});

app.post("/api/getUserConvo", auth, async (req, res) => {
  try {
    const currentUser = jwt.verify(req.body.token, process.env.TOKEN_KEY);
    console.log(currentUser);
    const userId = currentUser.id;

    const result = await Conversation.find({ userId })
      .sort({ timestamp: -1 })
      .limit(100);
    res.status(200).json({
      success: true,
      message: `Latest 100 conversations for userId ${userId}:`,
      data: result,
    });
  } catch (error) {
    console.error("Error querying MongoDB:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

app.get("/api/logout", async () => {
  localStorage.setItem("token", null);
  return res.status(200);
});

server.listen(PORT, () => {
  console.log("Server is running...");
});
