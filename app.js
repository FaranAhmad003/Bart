const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
let lastPrice=null;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


const cryptoList = [
  { symbol: "ETH", url: "wss://stream.binance.com:9443/ws/etheur@trade" },
  { symbol: "BTC", url: "wss://stream.binance.com:9443/ws/btceur@trade" },
  { symbol: "BNB", url: "wss://stream.binance.com:9443/ws/bnbeur@trade" },
  { symbol: "ADA", url: "wss://stream.binance.com:9443/ws/adaeur@trade" },
  { symbol: "XRP", url: "wss://stream.binance.com:9443/ws/xrpeur@trade" },
];

cryptoList.forEach((crypto) => {
  const ws = new WebSocket(crypto.url);
  ws.on("message", (data) => {
    const stockObject = JSON.parse(data);
    const price = parseFloat(stockObject.p).toFixed(3);
    io.emit(crypto.symbol, price);
  });
});

server.listen(3000, () => {
  console.log("Crypto dashboard running at http://localhost:3000");
});
