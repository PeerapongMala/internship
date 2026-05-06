namespace BSS_WEB.Interfaces
{
    public interface IAppClient
    {
        Task<HttpResponseMessage> SendInternalAsync(object request, HttpMethod method, string uri);
        Task<HttpResponseMessage> SendInternalAsync(object request, HttpMethod method, Uri uri);
        Task<HttpResponseMessage> SendInternalAsync(HttpMethod method, string uri);
        Task<HttpResponseMessage> SendInternalAsync(HttpMethod method, Uri uri);
        Task<HttpResponseMessage> SendAsync(HttpRequestMessage request);
        Task<string> GetStringAsync(string requestUri);
    }
}
