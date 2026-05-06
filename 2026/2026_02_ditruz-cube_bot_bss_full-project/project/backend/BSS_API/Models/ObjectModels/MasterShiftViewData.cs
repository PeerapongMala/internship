
namespace BSS_API.Models.ObjectModels
{
    public class MasterShiftViewData
    {
        public int ShiftId { get; set; }
        public string ShiftCode { get; set; }
        public string? ShiftName { get; set; }
        public string ShiftStartTime { get; set; }
        public string ShiftEndTime { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
