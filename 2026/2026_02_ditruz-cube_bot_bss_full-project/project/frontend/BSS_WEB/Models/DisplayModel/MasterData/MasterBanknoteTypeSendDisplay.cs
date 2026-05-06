using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterBanknoteTypeSendDisplay
    {
        [Display(Name = "Banknote Type Send Id")]
        public int banknoteTypeSendId { get; set; }

        [Display(Name = "Banknote Type Send Code")]
        
        public string banknoteTypeSendCode { get; set; }

        [Display(Name = "BSS Bn Type Code")]
        public string bssBntypeCode { get; set; }

        [Display(Name = "Banknote Type Send Description")]
         
        public string? banknoteTypeSendDesc { get; set; }

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
