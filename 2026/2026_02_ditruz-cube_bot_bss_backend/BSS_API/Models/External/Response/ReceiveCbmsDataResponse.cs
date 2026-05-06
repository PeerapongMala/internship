namespace BSS_API.Models.External.Response
{
    using Request;
    using Newtonsoft.Json;
    
    public class ReceiveCbmsDataResponse
    {
        [JsonProperty("bssResponse")] public BSSResponse BSSResponse { get; set; } = new ();
    }

    public class BSSResponse
    {
        [JsonProperty("isSuccess")] public bool IsSuccess { get; set; }
        
        [JsonProperty("msgCode")] public string MessageCode { get; set; }
        
        [JsonProperty("msgDesc")] public string? MessageDescription { get; set; }
        
        [JsonProperty("connectInfo")] public ReceiveCbmsConnectInfo? ConnectionInfo { get; set; }
        
        [JsonProperty("data")] public ICollection<object>? Data { get; set; } = new List<object>();
    }
}
