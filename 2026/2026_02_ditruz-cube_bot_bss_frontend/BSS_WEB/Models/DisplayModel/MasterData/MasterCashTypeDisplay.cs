using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterCashTypeDisplay
    {
        [Display(Name = "CashType Id")]
        public int cashTypeId { get; set; }

        [Display(Name = "CashType Code")]
        [MaxLength(10)]
        public string cashTypeCode { get; set; }

        [Display(Name = "CashType Name")]
        [MaxLength(10)]
        public string cashTypeName { get; set; }

        [Display(Name = "CashType Description")]
        [MaxLength(30)]
        public string cashTypeDesc { get; set; }

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
