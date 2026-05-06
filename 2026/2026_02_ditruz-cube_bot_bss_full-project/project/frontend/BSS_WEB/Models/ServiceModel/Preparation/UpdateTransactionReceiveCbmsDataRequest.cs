using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class UpdateTransactionReceiveCbmsDataRequest
    {
        [Required]
        public long receiveId { get; set; }

        [Required]
        public int departmentId { get; set; }

        [Required]
        [MaxLength(3)]
        public string bnTypeInput { get; set; }

        [MaxLength(20)]
        public string? barCode { get; set; }

        [MaxLength(20)]
        public string? containerId { get; set; }

        public DateTime? sendDate { get; set; }

        [Required]
        public int institutionId { get; set; }

        public int denominationId { get; set; }

        public int? qty { get; set; }

        public int? remainingQty { get; set; }

        public int? unfitQty { get; set; }

        [MaxLength(5)]
        public string? cbBdcCode { get; set; }

        [MaxLength(20)]
        public int? updatedBy { get; set; }
    }
}
