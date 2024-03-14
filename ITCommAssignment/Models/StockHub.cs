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

                await Task.Delay(TimeSpan.FromSeconds(5));
            }
        }

        private async Task<string> FetchStockData(string symbol)
        {
            var apiKey = "1YUDB4FMJL3QSDC9";
            var url = $"https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=1min&apikey={apiKey}";

            using (var client = new HttpClient())
            {
                var response = await client.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadAsStringAsync();
                    return content;
                }
                else
                {
                    throw new Exception("Failed to fetch stock data.");
                }
            }
        }
    }
}
