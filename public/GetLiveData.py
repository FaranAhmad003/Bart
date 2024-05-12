import requests
import json

# Dictionary mapping coin IDs to their names
coin_ids = {
    "ethereum": "Ethereum",
    "iota": "Iota",
    "chainlink": "ChainLink",
    "dogecoin": "Dogecoin",
    "aave": "Aave",
    "cardano": "Cardano",
    "bitcoin": "Bitcoin",
    "litecoin": "Litecoin",
    "eos": "EOS",
    "cosmos": "Cosmos",
    "monero": "Monero",
    "solana": "Solana",
    "polkadot": "Polkadot",
    "nem": "NEM",
    "usdcoin": "USD Coin",
    "tron": "Tron",
    "stellar": "Stellar",
    "tether": "Tether",
    "uniswap": "Uniswap",
    "xrp": "XRP"
}

base_url = "http://api.coincap.io/v2/assets/{}/history?interval=d1&start=1592585794000&end=1613753794000"
headers = {}

# Dictionary to store closing prices for the last 15 days for each coin
closing_prices_last_15_days = {coin_name: [] for coin_name in coin_ids.values()}

for coin_id, coin_name in coin_ids.items():
    url = base_url.format(coin_id)
    response = requests.get(url, headers=headers)
    json_data = json.loads(response.text)
    
    if "data" in json_data:
        coin_data = json_data["data"]
        last_15_days_data = coin_data[-15:]
        
        # List to store closing prices for this particular coin
        coin_closing_prices = []
        
        for data_point in last_15_days_data:
            price = float(data_point["priceUsd"])
            coin_closing_prices.append(price)
        
        # Store closing prices for this coin in the main dictionary
        closing_prices_last_15_days[coin_name] = coin_closing_prices
    else:
        print(f"No data found for coin: {coin_name}")

# Generate JavaScript code 
js_code = "var coinClosingPrices = {\n"

for coin_name, coin_closing_prices in closing_prices_last_15_days.items():
    js_code += f'    "{coin_name}": {json.dumps(coin_closing_prices)},\n'

js_code += "};"

# Write .js file
with open("coinClosingPrices.js", "w") as js_file:
    js_file.write(js_code)

print("JavaScript file Updated successfully ")
