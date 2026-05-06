namespace BSS_API.Models.RequestModels
{
    public class ConfigFilterRequest
    {
        public string ConfigTypeFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}
