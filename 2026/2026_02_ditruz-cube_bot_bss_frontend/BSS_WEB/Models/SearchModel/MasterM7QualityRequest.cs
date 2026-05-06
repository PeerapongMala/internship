namespace BSS_API.Models.RequestModels
{
    public class MasterM7QualityRequest
    {
        public int? M7QualityId { get; set; }
        public string M7QualityCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    }
}

