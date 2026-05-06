namespace BSS_API.Models.RequestModels
{
    public class ZoneCashpointFilterRequest
    {
        public string ZoneFilter { get; set; } = string.Empty;
        public string CashpointFilter { get; set; } = string.Empty;
        public string StatusFilter { get; set; } = string.Empty;
    }
}
