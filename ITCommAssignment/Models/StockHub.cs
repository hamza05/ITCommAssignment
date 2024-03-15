using Microsoft.AspNetCore.SignalR;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace ITCommAssignment.Models
{
    public class StockHub : Hub
    {
        private readonly string[] _symbols = { "IBM", "AAPL", "GOOGL" };

        public async Task StreamStockData()
        {
            while (true)
            {
                foreach (var symbol in _symbols)
                {
                    try
                    {
                        var stockData = await FetchStockData(symbol);
                        await Clients.All.SendAsync("ReceiveStockData", symbol, stockData);
                    }
                    catch (Exception ex)
                    {
                        // Handle error
                    }
                }

                await Task.Delay(TimeSpan.FromSeconds(5000));
            }
        }
        /// <summary>
        /// Fetches stock data for a given symbol from Alpha Vantage API.
        /// Note: Since the Alpha Vantage API free tier has a limit of 25 calls per day,
        /// this method currently hardcodes the response for demonstration purposes.
        /// </summary>
        /// <param name="symbol">The stock symbol to fetch data for.</param>
        /// <returns>A JSON string containing the stock data.</returns>

        private async Task<string> FetchStockData(string symbol)
        {
            var apiKey = "1YUDB4FMJL3QSDC9";
            var url = $"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={apiKey}";

            //using (var client = new HttpClient())
            //{
            //    var response = await client.GetAsync(url);

            //    if (response.IsSuccessStatusCode)
            //    {
            //        var content = await response.Content.ReadAsStringAsync();
            //        return content;
            //    }
            //    else
            //    {
            //        throw new Exception("Failed to fetch stock data.");
            //    }
            //}
            await Task.Delay(1000);
            return symbol == "IBM" ? "{\r\n\r\n    \"Meta Data\": {\r\n\r\n        \"1. Information\": \"Intraday (1min) open, high, low, close prices and volume\",\r\n\r\n        \"2. Symbol\": \"IBM\",\r\n\r\n        \"3. Last Refreshed\": \"2024-03-14 19:59:00\",\r\n\r\n        \"4. Interval\": \"1min\",\r\n\r\n        \"5. Output Size\": \"Compact\",\r\n\r\n        \"6. Time Zone\": \"US/Eastern\"\r\n\r\n    },\r\n\r\n    \"Time Series (1min)\": {\r\n\r\n        \"2024-03-14 19:59:00\": {\r\n\r\n            \"1. open\": \"193.0100\",\r\n\r\n            \"2. high\": \"193.2900\",\r\n\r\n            \"3. low\": \"193.0000\",\r\n\r\n            \"4. close\": \"193.2900\",\r\n\r\n            \"5. volume\": \"87\"\r\n\r\n        }\r\n}}"
                : symbol == "AAPL" ? "{\r\n\r\n    \"Meta Data\": {\r\n\r\n        \"1. Information\": \"Intraday (1min) open, high, low, close prices and volume\",\r\n\r\n        \"2. Symbol\": \"APPL\",\r\n\r\n        \"3. Last Refreshed\": \"2024-03-14 19:59:00\",\r\n\r\n        \"4. Interval\": \"1min\",\r\n\r\n        \"5. Output Size\": \"Compact\",\r\n\r\n        \"6. Time Zone\": \"US/Eastern\"\r\n\r\n    },\r\n\r\n    \"Time Series (1min)\": {\r\n\r\n        \"2024-03-14 19:59:00\": {\r\n\r\n            \"1. open\": \"1293.0100\",\r\n\r\n            \"2. high\": \"1293.2900\",\r\n\r\n            \"3. low\": \"1293.0000\",\r\n\r\n            \"4. close\": \"1293.2900\",\r\n\r\n            \"5. volume\": \"87\"\r\n\r\n        }\r\n}}" 
                : "{\r\n\r\n    \"Meta Data\": {\r\n\r\n        \"1. Information\": \"Intraday (1min) open, high, low, close prices and volume\",\r\n\r\n        \"2. Symbol\": \"GOOGL\",\r\n\r\n        \"3. Last Refreshed\": \"2024-03-14 19:59:00\",\r\n\r\n        \"4. Interval\": \"1min\",\r\n\r\n        \"5. Output Size\": \"Compact\",\r\n\r\n        \"6. Time Zone\": \"US/Eastern\"\r\n\r\n    },\r\n\r\n    \"Time Series (1min)\": {\r\n\r\n        \"2024-03-14 19:59:00\": {\r\n\r\n            \"1. open\": \"293.0100\",\r\n\r\n            \"2. high\": \"293.2900\",\r\n\r\n            \"3. low\": \"293.0000\",\r\n\r\n            \"4. close\": \"293.2900\",\r\n\r\n            \"5. volume\": \"87\"\r\n\r\n        }\r\n}}";
        }
    }
}
