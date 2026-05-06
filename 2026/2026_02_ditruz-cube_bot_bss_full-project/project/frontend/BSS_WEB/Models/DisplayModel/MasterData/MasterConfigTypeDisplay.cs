using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterConfigTypeDisplay
    {
        [Display(Name = "Config Type Id")]
        public int configTypeId { get; set; }

        [MaxLength(10)]
        [Display(Name = "Config Type Code")]
        public string? configTypeCode { get; set; }

        [MaxLength(100)]
        [Display(Name = "Config Type Desc")]
        public string? configTypeDesc { get; set; }

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