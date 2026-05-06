namespace BSS_API.Models.ObjectModels
{
    public class ShiftInfoData
    {
        public int ShiftId { get; set; }
        public string? ShiftCode { get; set; }
        public string? ShiftName { get; set; }
        public string? ShiftStartTimeText { get; set; }
        public string? ShiftEndTimeText { get; set; }
        public TimeSpan? ShiftStartTime { get; set; }
        public TimeSpan? ShiftEndTime { get; set; }
    }
}
