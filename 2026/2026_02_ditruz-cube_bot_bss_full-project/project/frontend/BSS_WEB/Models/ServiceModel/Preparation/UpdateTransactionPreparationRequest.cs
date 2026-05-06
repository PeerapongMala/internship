using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class UpdateTransactionPreparationRequest
    {
        [Required]
        public long prepareId { get; set; }

        [Required]
        public long containerPrepareId { get; set; }

        [Required]
        public string headerCardCode { get; set; }

        [Required]
        public string packageCode { get; set; }

        [Required]
        public string bundleCode { get; set; }

        [Required]
        public int instId { get; set; }

        public int? cashcenterId { get; set; }

        public int? zoneId { get; set; }

        public int? cashpointId { get; set; }

        [Required]
        public int denoId { get; set; }

        [Required]
        public int qty { get; set; }

        public string? remark { get; set; }

        [Required]
        public int statusId { get; set; }

        [Required]
        public DateTime prepareDate { get; set; }

        public bool? isReconcile { get; set; }

        public bool? isActive { get; set; }

        public int? updatedBy { get; set; }
    }
}
