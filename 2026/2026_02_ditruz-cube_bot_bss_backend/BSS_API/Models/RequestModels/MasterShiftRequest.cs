namespace BSS_API.Models.RequestModels
{
    public class MasterShiftRequest
    {         
        public int? ShiftId { get; set; }
        public string ShiftCode { get; set; } = string.Empty;  
        public bool? IsActive { get; set; } 
    }
}
