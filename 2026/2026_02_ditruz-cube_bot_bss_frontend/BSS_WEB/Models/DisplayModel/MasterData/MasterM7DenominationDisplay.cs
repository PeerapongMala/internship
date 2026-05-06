using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterM7DenominationDisplay
    {
        [Display(Name = "M7 Denomination Id")]
        public int m7DenomId { get; set; }

        [Display(Name = "Denomination Id")]
        public int denoId { get; set; }

        public int denominationCode { get; set; }
        public string? denominationDesc { get; set; }

        public int seriesDenomId { get; set; }
        public string seriesDenomCode { get; set; }
        public string seriesDenomDesc { get; set; }


        [Display(Name = "M7 Denomination Code")]

        public string m7DenomCode { get; set; }

        [Display(Name = "M7 Denomination Name")]

        public string m7DenomName { get; set; }

        [Display(Name = "M7 Denomination Description")]

        public string m7DenomDescrpt { get; set; }

        [Display(Name = "M7 Denomination BMS")]
        [MaxLength(10)]
        public string m7DenomBms { get; set; }

        [Display(Name = "M7 DN BMS")]
        [MaxLength(10)]
        public string m7DnBms { get; set; }

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


 