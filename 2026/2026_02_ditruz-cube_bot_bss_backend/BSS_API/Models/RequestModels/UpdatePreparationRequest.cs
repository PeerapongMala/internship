using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdatePreparationRequest
    {
        [Required]
        public long PrepareId { get; set; }

        [Required]
        public long ContainerPrepareId { get; set; }

        [Required]
        public string HeaderCardCode { get; set; }

        [Required]
        public string PackageCode { get; set; }

        [Required]
        public string BundleCode { get; set; }

        [Required]
        public int InstId { get; set; }

        public int? CashcenterId { get; set; }

        public int? ZoneId { get; set; }

        public int? CashpointId { get; set; }

        [Required]
        public int DenoId { get; set; }

        [Required]
        public int Qty { get; set; }

        public string? Remark { get; set; }

        [Required]
        public int StatusId { get; set; }

        [Required]
        public DateTime PrepareDate { get; set; }

        public bool? IsReconcile { get; set; }

        public bool? IsActive { get; set; }

        public int? UpdatedBy { get; set; }
    }
}
