using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterDenominationDisplay
    {
        [Display(Name = "Denomination Id")]
        public int denominationId { get; set; }

        [Display(Name = "Denomination Code")]
        [MaxLength(10)]
        public string denominationCode { get; set; }

        [Display(Name = "denomination Price")]
        public int denominationPrice { get; set; }

        [Display(Name = "Denomination Description")]
        [MaxLength(20)]
        public string denominationDesc { get; set; }

        [Display(Name = "Denomination Currency")]
        [MaxLength(10)]
        public string denominationCurrency { get; set; }
        
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
