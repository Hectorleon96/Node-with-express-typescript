import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Create WebSocket server attached to the same HTTP server later
const server = app.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("New WebSocket client connected");

  ws.on("message", (message) => {
    console.log("Received from client WS:", message.toString());
  });
});

// Broadcast helper function to send message to all clients
function broadcast(data: string) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}

// POST endpoint
app.post("/your-post-endpoint", (req, res) => {
  const body = req.body;
  console.log("POST body:", body);

  // Send immediate HTTP response to client (Postman or frontend fetch)
  res.json({ message: "Data received successfully" });

  // Then broadcast the data/message to all connected WS clients
  broadcast(`New data received: ${JSON.stringify(body)}`);
});
