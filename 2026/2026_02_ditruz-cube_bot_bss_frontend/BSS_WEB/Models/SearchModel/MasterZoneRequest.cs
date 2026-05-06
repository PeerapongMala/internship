namespace BSS_API.Models.RequestModels
{
    public class MasterZoneRequest
    {
        public int? ZoneId { get; set; }
        public int? DepartmentId { get; set; }
        public int? InstId { get; set; }
        public string ZoneCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }
}

