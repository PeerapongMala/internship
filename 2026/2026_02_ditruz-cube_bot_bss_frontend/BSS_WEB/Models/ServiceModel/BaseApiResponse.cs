using Newtonsoft.Json;

namespace BSS_WEB.Models.ServiceModel
{
    public class BaseApiResponse
    {
        public bool is_success { get; set; }
        public string msg_code { get; set; } = string.Empty;
        public string msg_desc { get; set; } = string.Empty;
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        } 
    }
    public class BaseApiResponse<TData> : BaseApiResponse
    {
        public TData? data { get; set; }
    }
}
