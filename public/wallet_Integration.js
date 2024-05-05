document.addEventListener('DOMContentLoaded', async () => {
    if (typeof window.ethereum !== 'undefined') {
        // MetaMask is installed
        const web3 = new Web3(window.ethereum);

        try {
            // Request account access if needed
            await window.ethereum.enable();

            // Get user's account address
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];
            console.log("Connected with MetaMask account:", userAddress);

            // Display user's ETH balance
            const balance = await web3.eth.getBalance(userAddress);
            console.log("ETH balance:", web3.utils.fromWei(balance, 'ether'), "ETH");

            // Your additional Web3.js code here...
        } catch (error) {
            console.error("MetaMask account access denied:", error);
        }
    } else {
        // MetaMask is not installed
        alert("Please install MetaMask to use this site");
    }
});
