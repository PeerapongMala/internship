namespace BSS_WEB.Models.ObjectModel
{
    public class CreateShiftRequest
    { 
        public string shiftCode { get; set; } = string.Empty;
        public string? shiftName { get; set; } = string.Empty;
        public string shiftStartTime { get; set; } = string.Empty;
        public string shiftEndTime { get; set; } = string.Empty;
        public bool isActive { get; set; } = false;
        
    }
}
