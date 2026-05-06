namespace BSS_API.Models.ResponseModels
{
    public class InvalidInputErrorResponse
    {
        public bool is_success { get; set; }
        public string msg_code { get; set; } = string.Empty;
        public string msg_desc { get; set; } = string.Empty;
        public string parameter_neme { get; set; } = string.Empty;
    }
}
