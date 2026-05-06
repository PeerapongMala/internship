using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_WEB.Models.DisplayModel
{
    public class MasterBanknoteTypeDisplay:MasterCommonData
    {
        [Display(Name = "Banknote Type Id")]
        public int banknoteTypeId { get; set; }

        [Display(Name = "Banknote Type Name")]
        [MaxLength(30)]
        public string banknoteTypeName { get; set; }

        [Display(Name = "Banknote Type Description")]
        [MaxLength(50)]
        public string? banknoteTypeDesc { get; set; } 
        [Display(Name = "Banknote Type Code")]
        public string BanknoteTypeCode { get; set; }
        [Display(Name = "BSS Banknote Type Code")]
        public string BssBanknoteTypeCode { get; set; }
    }
}
