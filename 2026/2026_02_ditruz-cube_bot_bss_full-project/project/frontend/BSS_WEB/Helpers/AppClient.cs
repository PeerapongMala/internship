using BSS_WEB.Interfaces;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace BSS_WEB.Helpers
{
    public class AppClient : IAppClient
    {
        private readonly HttpClient _httpClient;
        public AppClient(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        public async Task<HttpResponseMessage> SendInternalAsync(object request, HttpMethod method, string uri)
        {
            return await this.SendInternalAsync(request, method, new Uri(uri));
        }

        public async Task<HttpResponseMessage> SendInternalAsync(object request, HttpMethod method, Uri uri)
        {
            var apiKey = AppConfig.BssApiServiceKey;
            var httpRequestMsg = new HttpRequestMessage(method, uri);
            var content = Newtonsoft.Json.JsonConvert.SerializeObject(request);
            httpRequestMsg.Content = new StringContent(content,
                                                Encoding.UTF8,
                                                "application/json");

            httpRequestMsg.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            //httpRequestMsg.Headers.Add("signature", signature);
            httpRequestMsg.Headers.Add("x-api-key", apiKey);

            return await _httpClient.SendAsync(httpRequestMsg, HttpCompletionOption.ResponseHeadersRead).ConfigureAwait(true);
        }

        public async Task<HttpResponseMessage> SendInternalAsync(HttpMethod method, string uri)
        {
            return await SendInternalAsync(method, new Uri(uri));
        }
        public async Task<HttpResponseMessage> SendInternalAsync(HttpMethod method, Uri uri)
        {
            var apiKey = AppConfig.BssApiServiceKey;
            var httpRequestMsg = new HttpRequestMessage(method, uri);
            httpRequestMsg.Content = new StringContent(string.Empty,
                                                Encoding.UTF8,
                                                "application/json");

            httpRequestMsg.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            //httpRequestMsg.Headers.Add("signature", signature);
            httpRequestMsg.Headers.Add("x-api-key", apiKey);

            return await _httpClient.SendAsync(httpRequestMsg, HttpCompletionOption.ResponseHeadersRead).ConfigureAwait(true);
        }
        public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
        {
            return await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead).ConfigureAwait(true);
        }
        public async Task<string> GetStringAsync(string requestUri)
        {
            return await _httpClient.GetStringAsync(requestUri);
        }
    }
}
