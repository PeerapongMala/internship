using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.ObjectModels
{
    public class TransactionReceiveCbmsViewData
    {
        [Required]
        public long ReceiveId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public string? DepartmentName { get; set; }

        [Required]
        [MaxLength(3)]
        public string BnTypeInput { get; set; }

        [MaxLength(20)]
        public string? BarCode { get; set; }

        [MaxLength(20)]
        public string? ContainerId { get; set; }

        public DateTime? SendDate { get; set; }

        [Required]
        public int InstitutionId { get; set; }

        public string? InstitutionShortName { get; set; }

        [Required]
        public int DenominationId { get; set; }

        public int? DenominationPrice { get; set; }

        public int? Qty { get; set; }

        public int? RemainingQty { get; set; }

        public int? UnfitQty { get; set; }

        [MaxLength(5)]
        public string? CbBdcCode { get; set; }
        public string? BankCode { get; set; }
        public string? CashCenterCode { get; set; }
        public string? CashCenterName { get; set; }

        public bool hasCrossMachineConflict { get; set; } = false;

        public string CrossMachineConflictMachines { get; set; }
         

    }
}
