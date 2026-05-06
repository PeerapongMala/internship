namespace BSS_API.Models.RequestModels
{
    public class MasterZoneCashpointRequest
    {
        public int? ZoneCashpointId { get; set; }
        public int? ZoneId { get; set; }
        public int? CashpointId { get; set; }
        public bool? IsActive { get; set; }
    }
}

