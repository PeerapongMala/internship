using Azure;
using System.Text;
using System.Net.Http.Headers;

namespace BSS_API.Helpers
{
    public interface IAppClient
    {
        Task<HttpResponseMessage> SendInternalAsync(string signature, object request, HttpMethod method, string uri);
        Task<HttpResponseMessage> SendInternalAsync(string signature, object request, HttpMethod method, Uri uri);
        Task<HttpResponseMessage> SendInternalAsync(string signature, HttpMethod method, string uri);
        Task<HttpResponseMessage> SendInternalAsync(string signature, HttpMethod method, Uri uri);
        Task<HttpResponseMessage> SendAsync(HttpRequestMessage request);
        Task<string> GetStringAsync(string requestUri);
    }

    public class AppClient : IAppClient
    {
        private readonly HttpClient _httpClient;

        public AppClient(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        public async Task<HttpResponseMessage> SendInternalAsync(string signature, object request, HttpMethod method, string uri)
        {
            return await this.SendInternalAsync(signature, request, method, new Uri(uri));
        }

        public async Task<HttpResponseMessage> SendInternalAsync(string signature, object request, HttpMethod method, Uri uri)
        {

            var httpRequestMsg = new HttpRequestMessage(method, uri);
            var content = Newtonsoft.Json.JsonConvert.SerializeObject(request);
            httpRequestMsg.Content = new StringContent(content,
                                                Encoding.UTF8,
                                                "application/json");

            httpRequestMsg.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            httpRequestMsg.Headers.Add("x-api-key", signature);

            return await _httpClient.SendAsync(httpRequestMsg, HttpCompletionOption.ResponseHeadersRead).ConfigureAwait(false);
        }

        public async Task<HttpResponseMessage> SendInternalAsync(string signature, HttpMethod method, string uri)
        {
            return await SendInternalAsync(signature, method, new Uri(uri));
        }

        public async Task<HttpResponseMessage> SendInternalAsync(string signature, HttpMethod method, Uri uri)
        {
            var httpRequestMsg = new HttpRequestMessage(method, uri);
            httpRequestMsg.Content = new StringContent(string.Empty,
                                                Encoding.UTF8,
                                                "application/json");

            httpRequestMsg.Content.Headers.ContentType = MediaTypeHeaderValue.Parse("application/json");
            httpRequestMsg.Headers.Add("x-api-key", signature);

            return await _httpClient.SendAsync(httpRequestMsg, HttpCompletionOption.ResponseHeadersRead).ConfigureAwait(false);
        }

        public async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request)
        {
            return await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead).ConfigureAwait(false);
        }
        public async Task<string> GetStringAsync(string requestUri)
        {
            return await _httpClient.GetStringAsync(requestUri);
        }
    }
}
