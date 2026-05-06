using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterConfigDisplay
    {

        [Display(Name = "Config Id")]
        public int configId { get; set; }

        [Display(Name = "Config Type Id")]
        public int configTypeId { get; set; }

        [MaxLength(50)]
        [Display(Name = "Config Code")]
        public string? configCode { get; set; }

        [MaxLength(300)]
        [Display(Name = "Config Value")]
        public string? configValue { get; set; }

        [MaxLength(300)]
        [Display(Name = "Config Description")]
        public string? configDesc { get; set; }

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

        [Display(Name = "ConfigType Desc")]
        public string? configTypeDesc { get; set; }

    }
}
