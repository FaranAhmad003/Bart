const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(".")); // Serve static files from the current directory

const cryptoList = [
  { symbol: "ETH", url: "wss://stream.binance.com:9443/ws/ethusdt@trade" },
  { symbol: "BTC", url: "wss://stream.binance.com:9443/ws/btcusdt@trade" },
  { symbol: "DOGE", url: "wss://stream.binance.com:9443/ws/dogeusdt@trade" },
];

cryptoList.forEach(({ symbol, url }) => {
  const ws = new WebSocket(url);

  ws.on("message", (data) => {
    const { p: price } = JSON.parse(data);
    io.emit(symbol, { symbol, price });
  });
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
