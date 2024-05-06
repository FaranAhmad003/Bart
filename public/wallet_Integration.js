
async function checkMetaMaskConnection() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });

            if (accounts.length > 0) {
                const accountAddress = accounts[0];
                displayAccountInfo(accountAddress);
            } else {
                await requestAccount();
            }
        } catch (error) {
            console.error('Error checking MetaMask connection:', error);
            alert('Error checking MetaMask connection. Please try again.');
        }
    } else {
        alert('Please install MetaMask Wallet');
    }
}

async function requestAccount() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accountAddress = accounts[0];
        displayAccountInfo(accountAddress);
    } catch (error) {
        console.error('Error connecting to MetaMask:', error);
        alert('Error connecting to MetaMask. Please try again.');
    }
}

function displayAccountInfo(accountAddress) {
    document.getElementById('accountAddress').textContent = accountAddress;
    getAccountBalance(accountAddress);
}

async function getAccountBalance(accountAddress) {
    try {
        const balanceWei = await window.ethereum.request({ method: 'eth_getBalance', params: [accountAddress] });
        const balanceEth = parseFloat(window.ethereum.utils.fromWei(balanceWei, 'ether')).toFixed(4);
        document.getElementById('accountBalance').textContent = balanceEth;
    } catch (error) {
        alert('Error getting account balance / Balance is 0. Please try again.');
    }
}
