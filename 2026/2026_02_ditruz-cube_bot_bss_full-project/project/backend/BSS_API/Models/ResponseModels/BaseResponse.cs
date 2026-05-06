using BSS_API.Models.ObjectModels;
using Newtonsoft.Json;

namespace BSS_API.Models.ResponseModels
{
    public class BaseResponse<TData>
    {
        public bool is_success { get; set; }
        public string msg_code { get; set; } = string.Empty;
        public string msg_desc { get; set; } = string.Empty;
        public TData data { get; set; }
        public override string ToString()
        {
            return JsonConvert.SerializeObject(this);
        }
    }
}
