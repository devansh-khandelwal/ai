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
import {auth} from "./auth.js";
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
      const reply = completion.choices[0].message.content
      socket.emit("reply", reply);
      console.log(req.user);
      // save this in database
      var newConversation = await Conversation.create({
        userId: req.userId,
        message: req.message,
        reply: reply
      })
      .catch(error => {
        console.error('Error saving conversation in db:', error);
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

// Login
app.post("/api/login", async (req, res) => {
  // Our login logic starts here

  // console.log(req.body);
  // return res.status(200);
  try {
    // Get user input
    // const data = JSON.parse(req.body); // change accoringly
    const data = req.body;
    const { email, password } = data;

    var user = await User.findOne({ email });
    if (!(email && password)) {
      return res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    if (user === null) {
      //Encrypt user password
      var encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      user = await User.create({
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
      })
      .catch(error => {
        console.error('Error saving user in db:', error);
      });
    }

    console.log("user " + user);
    const id = user._id;
    console.log(id);

    if (await bcrypt.compare(password, user.password)) {
      // Create token
      // const token_key = "abcdefgh";
      const token = jwt.sign({ email, id }, process.env.TOKEN_KEY, {
        expiresIn: "2h",
      });
      // save user token
      user.token = token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }

      // return frontend user
     
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


app.post('/api/getUserConvo', auth, async (req, res) => {
  try {
    // Use the Conversation model to query the database

    const currentUser = jwt.verify(req.body.token, process.env.TOKEN_KEY);
    console.log(currentUser);
    const userId = currentUser.id;

    const result = await Conversation.find( { userId } )
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(100); // Limit to 100 documents

    
    // console.log('Latest 100 conversations:', result);
    res.status(200).json({
      success: true,
      message: `Latest 100 conversations for userId ${userId}:`,
      data: result,
    });
  } catch (error) {
    console.error('Error querying MongoDB:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
});

app.get("/api/logout", async () => {
  localStorage.setItem("token", null);
  return res.status(200);
});
// login/register logic end

server.listen(PORT, () => {
  console.log("Server is running...");
});



////////////////////// testing routes delete later ///////////////////////


app.get('/test', async (req, res) => {
  try {
    // Retrieve all documents from the 'conversations' collection
    const conversations = await Conversation.find({});

    // Log the conversations
    console.log('All conversations:', conversations);

    // Respond with the conversations as JSON
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error retrieving conversations:', error);
    res.status(500).send('Internal Server Error');
  }
});