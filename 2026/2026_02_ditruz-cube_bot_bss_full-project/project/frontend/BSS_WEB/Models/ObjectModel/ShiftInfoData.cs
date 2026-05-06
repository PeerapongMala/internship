namespace BSS_WEB.Models.ObjectModel
{
    public class ShiftInfoData
    {
        public int shiftId { get; set; }
        public string shiftCode { get; set; }
        public string? shiftName { get; set; }
        public string shiftStartTimeText { get; set; }
        public string shiftEndTimeText { get; set; }
        public TimeSpan shiftStartTime { get; set; }
        public TimeSpan shiftEndTime { get; set; }
    }
}
