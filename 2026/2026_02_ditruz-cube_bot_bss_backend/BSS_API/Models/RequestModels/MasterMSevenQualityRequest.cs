namespace BSS_API.Models.RequestModels
{
    public class MasterMSevenQualityRequest
    {         
        public int? M7QualityId { get; set; }
        public string M7QualityCode { get; set; } = string.Empty;
       
        public bool? IsActive { get; set; } 
    }
}
