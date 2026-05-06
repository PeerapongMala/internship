using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels.MasterData
{
    public class CreateBanknoteTypeRequest
    {
        [Required]
        [MaxLength(3)]
        public string BanknoteTypeCode { get; set; }

        [Required]
        [MaxLength(3)]
        public string BssBanknoteTypeCode { get; set; }


        [Required]
        [MaxLength(30)]
        public string BanknoteTypeName { get; set; }

        [MaxLength(50)]
        public string? BanknoteTypeDesc { get; set; }

        public bool? IsDisplay { get; set; }

        public bool? IsActive { get; set; }
         
    }
}
