namespace BSS_API.Models.RequestModels
{
    public class MasterMSevenOutputRequest
    {         
        public int? MSevenOutputId { get; set; }
        public string MSevenOutputCode { get; set; } = string.Empty;
       
        public bool? IsActive { get; set; } 
    }
}
