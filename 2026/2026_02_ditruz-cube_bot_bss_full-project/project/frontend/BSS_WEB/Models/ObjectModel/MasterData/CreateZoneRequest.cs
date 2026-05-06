namespace BSS_WEB.Models.ObjectModel
{
    public class CreateZoneRequest
    {
       
        public int departmentId { get; set; }
        public int? instId { get; set; }
        public string zoneCode { get; set; } = string.Empty;
        public string zoneName { get; set; } = string.Empty;
        public bool isActive { get; set; }
      
        public string cbBcdCode { get; set; } = string.Empty;
    }
}
