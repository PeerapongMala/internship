using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CheckReceiveCbmsTransactionRequest
    {
        [Required]
        public int DepartmentId { get; set; }

        [Required]
        [MaxLength(20)]
        public string ContainerId { get; set; }

        [Required]
        [MaxLength(20)]
        public string WrapBarcode { get; set; } = string.Empty;

        [Required]
        [MaxLength(3)]
        public string BnTypeInput { get; set; }

        [Required]
        public DateTime DateTimeStart { get; set; }

        [Required]
        public DateTime DateTimeEnd { get; set; }
    }
}
