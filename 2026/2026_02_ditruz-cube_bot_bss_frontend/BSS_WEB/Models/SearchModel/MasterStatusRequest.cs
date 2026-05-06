namespace BSS_API.Models.RequestModels
{
    public class MasterStatusRequest
    {
        public int? StatusId { get; set; }
        public string StatusCode { get; set; } = string.Empty;
        public bool? IsActive { get; set; }
    
    }
}

