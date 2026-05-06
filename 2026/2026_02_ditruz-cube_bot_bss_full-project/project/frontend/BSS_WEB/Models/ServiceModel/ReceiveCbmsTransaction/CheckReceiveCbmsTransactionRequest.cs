using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.ReceiveCbmsTransaction
{
    public class CheckReceiveCbmsTransactionRequest
    {
        [Required]
        public int departmentId { get; set; }

        [Required]
        [MaxLength(20)]
        public string containerId { get; set; }

        [Required]
        [MaxLength(20)]
        public string wrapBarcode { get; set; }

        [Required]
        [MaxLength(3)]
        public string bnTypeInput { get; set; }

        [Required]
        public DateTime dateTimeStart { get; set; }

        [Required]
        public DateTime dateTimeEnd { get; set; }
    }
}
