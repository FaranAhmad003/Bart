const axios = require("axios");
const MAX_RETRIES = 5; // Maximum number of retries
const BASE_DELAY = 1000; // Initial delay in milliseconds

async function fetchDataWithRetry(url, retries = 0) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    if (
      error.response &&
      error.response.status === 429 &&
      retries < MAX_RETRIES
    ) {
      // Wait for a specified delay before retrying
      const delay = BASE_DELAY * Math.pow(2, retries);
      console.log(`Waiting for ${delay} ms before retrying...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchDataWithRetry(url, retries + 1);
    } else {
      // Re-throw the error if not a rate limit issue or max retries reached
      throw error;
    }
  }
}

const url =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true";
fetchDataWithRetry(url)
  .then((data) => console.log(data))
  .catch((error) => console.error("Failed to fetch data:", error));
