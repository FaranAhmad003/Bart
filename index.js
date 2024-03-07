const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true"
    );
    res.render("index", { coins: response.data });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.send("Error fetching data");
  }
});

app.listen(port, () => {
  console.log(`Crypto dashboard running at http://localhost:${port}`);
});
