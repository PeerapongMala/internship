using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateBanknoteTypeSendRequest
    {
        [Required]
        public int BanknoteTypeSendId { get; set; }

        [Required]
        [MaxLength(10)]
        public string BanknoteTypeSendCode { get; set; }

        [Required]
        [MaxLength(10)]
        public string BssBntypeCode { get; set; }

        [MaxLength(50)]
        public string? BanknoteTypeSendDesc { get; set; }

        public bool IsActive { get; set; }

    }
}
