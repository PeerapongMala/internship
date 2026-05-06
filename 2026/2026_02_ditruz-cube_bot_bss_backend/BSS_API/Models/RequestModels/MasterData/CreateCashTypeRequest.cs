using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateCashTypeRequest
    {
        [Required]
        [MaxLength(10)]
        public string CashTypeCode { get; set; }

        [Required]
        [MaxLength(10)]
        public string CashTypeName { get; set; }

        [MaxLength(30)]
        public string CashTypeDesc { get; set; }

        public bool IsActive { get; set; }

      
    }
}
