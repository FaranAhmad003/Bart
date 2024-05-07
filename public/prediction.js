function navigateBack() {
    window.location.href = 'index.html'; // Navigate back to index.html
}

document.addEventListener('DOMContentLoaded', () => {
    const predictedPriceDiv = document.getElementById('predictedPrice');

    // Example: Get predicted price from AI (replace with your implementation)
    const predictedPrice = 50000.00; // Example predicted price in USD

    // Display predicted price in the webpage
    predictedPriceDiv.textContent = `Predicted Price: $${predictedPrice.toFixed(2)} USD`;
});
