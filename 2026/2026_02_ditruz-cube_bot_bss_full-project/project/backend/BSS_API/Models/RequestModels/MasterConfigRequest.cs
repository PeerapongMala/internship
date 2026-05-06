namespace BSS_API.Models.RequestModels
{
    public class MasterConfigRequest
    {         
        public int? ConfigId { get; set; }

        public int? ConfigTypeId { get; set; }

        public string ConfigCode { get; set; } = string.Empty;
        public string ConfigValue { get; set; } = string.Empty;
        public string ConfigDesc { get; set; } = string.Empty;
        public bool? IsActive { get; set; } 
    }
}
