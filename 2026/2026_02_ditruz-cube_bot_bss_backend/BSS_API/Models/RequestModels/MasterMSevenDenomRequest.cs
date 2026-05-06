namespace BSS_API.Models.RequestModels
{
    public class MasterMSevenDenomRequest
    {         
        public int? M7DenomId { get; set; }
        public int? DenoId { get; set; }
        public int? SeriesDenomId { get; set; }
        public string M7DenomCode { get; set; } = string.Empty; 
        
        public bool? IsActive { get; set; } 
    }
}
