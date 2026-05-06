using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class UnsortCCDisplay
    {
        [Display(Name = "UnsortCC Id")]
        public long unsortCCId { get; set; }

        [Display(Name = "Register Unsort Id")]
        public long registerUnsortId { get; set; }

        [Display(Name = "Inst Id")]
        public int instId { get; set; }

        [Display(Name = "Den Id")]
        public int denoId { get; set; }

        [Display(Name = "Banknote Type ")]
        public int banknoteType { get; set; }

        [Display(Name = "Banknote Qty")]
        public int banknoteQty { get; set; }

        [Display(Name = "Remaining Qty")]
        public int remainingQty { get; set; }

        [Display(Name = "Is Active")]
        public bool? isActive { get; set; }

        [Display(Name = "Create By")]
        public int? createdBy { get; set; }

        [Display(Name = "Create Date")]
        public DateTime? createdDate { get; set; }

        [Display(Name = "Update By")]
        public int? updatedBy { get; set; }

        [Display(Name = "Update Date")]
        public DateTime? updatedDate { get; set; }

        [Display(Name = "Institution Code")]
        public string? institutionCode { get; set; }

        [Display(Name = "Institution Name")]
        public string? institutionName { get; set; }

        [Display(Name = "Denomination Price")]
        public string? denominationPrice { get; set; }

        [Display(Name = "Container Code")]
        public string containerCode { get; set; }

        [Display(Name = "InstName Th ")]
        public string instNameTh { get; set; }

        [Display(Name = "Deno Price")]
        public int denoPrice { get; set; }
    }
}
