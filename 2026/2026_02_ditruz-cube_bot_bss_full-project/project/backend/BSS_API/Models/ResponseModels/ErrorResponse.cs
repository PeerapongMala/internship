using BSS_API.Models.ObjectModels;

namespace BSS_API.Models.ResponseModels
{
    public class ErrorResponse
    {

        public bool is_success { get; set; }
        public string msg_code { get; set; } = string.Empty;
        public string msg_desc { get; set; } = string.Empty;
    }
}
