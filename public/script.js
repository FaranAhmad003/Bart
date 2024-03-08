document.addEventListener("DOMContentLoaded", function () {
  const priceDisplay = document.getElementById("crypto-price"); // Assume an element with this ID in your HTML

  // Function to fetch cryptocurrency data
  async function fetchCryptoData() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
      );
      const data = await response.json();
      return data.bitcoin.usd;
    } catch (error) {
      console.error("Error fetching crypto data:", error);
      return null;
    }
  }

  // Function to update the webpage with the latest cryptocurrency data
  async function updateCryptoPrice() {
    const price = await fetchCryptoData();
    if (price !== null) {
      priceDisplay.textContent = `Bitcoin Price: $${price}`;
    } else {
      priceDisplay.textContent = "Failed to fetch price";
    }
  }

  // Update the price immediately when the page loads
  updateCryptoPrice();

  // Then update the price every minute (60000 milliseconds)
  setInterval(updateCryptoPrice, 60000);
});
