using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterShiftDisplay
    {
        [Display(Name = "Shift Id")]
        public int shiftId { get; set; }

        [Display(Name = "Shift Code")]
        [MaxLength(10)]
        public string shiftCode { get; set; }

        [Display(Name = "Shift Name")]
        [MaxLength(20)]
        public string? shiftName { get; set; }

        [Display(Name = "Shift StartTime")]
        [MaxLength(10)]
        public string shiftStartTime { get; set; }

        [Display(Name = "Shift EndTime")]
        [MaxLength(10)]
        public string shiftEndTime { get; set; }

        [Display(Name = "Is Active")]
        public bool isActive { get; set; }

        [Display(Name = "Create By")]
        public int? createdBy { get; set; }

        [Display(Name = "Create Date")]
        public DateTime? createdDate { get; set; }

        [Display(Name = "Update By")]
        public int? updatedBy { get; set; }

        [Display(Name = "Update Date")]
        public DateTime? updatedDate { get; set; }
    }
}
