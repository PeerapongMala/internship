using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.ResponseModels
{
    public class BaseCbmsResponseModel<TData>
    {
        public bool is_success { get; set; }
        public string msg_code { get; set; } = string.Empty;
        public string msg_desc { get; set; } = string.Empty;
        public ConnectInfoResult connectinfores { get; set; }
        public TData data { get; set; }
    }
}
