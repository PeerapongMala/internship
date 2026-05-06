using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class CreateTransactionReceiveCbmsDataRequest
    {
        [Required] public int DepartmentId { get; set; }

        [Required] [MaxLength(3)] public string BnTypeInput { get; set; }

        [MaxLength(20)] public string? BarCode { get; set; }

        [MaxLength(20)] public string? ContainerId { get; set; }

        public DateTime? SendDate { get; set; }

        [Required] public int InstitutionId { get; set; }

        public int DenominationId { get; set; }

        public int? Qty { get; set; }

        public int? RemainingQty { get; set; }

        public int? UnfitQty { get; set; }

        [MaxLength(5)] public string? CbBdcCode { get; set; }

        [Required] public int CreatedBy { get; set; }
    }
}