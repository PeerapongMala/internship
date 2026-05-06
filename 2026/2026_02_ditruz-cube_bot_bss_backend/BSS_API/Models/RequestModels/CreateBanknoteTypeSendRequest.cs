using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateBanknoteTypeSendRequest
    {
      
        [Required]
        [MaxLength(10)]
        public string BanknoteTypeSendCode { get; set; }

        [Required]
        [MaxLength(10)]
        public string BssBntypeCode { get; set; }

        [MaxLength(50)]
        public string? BanknoteTypeSendDesc { get; set; }

        public bool IsActive { get; set; }

        public int CreatedBy { get; set; }
    }
}
