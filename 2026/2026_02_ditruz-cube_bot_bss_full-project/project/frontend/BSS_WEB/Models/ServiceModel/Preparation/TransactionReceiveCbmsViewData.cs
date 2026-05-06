using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class TransactionReceiveCbmsViewData
    {
        [Required]
        public long receiveId { get; set; }

        [Required]
        public int departmentId { get; set; }

        public string? departmentName { get; set; }

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

        public string? institutionShortName { get; set; }

        [Required]
        public int denominationId { get; set; }

        public string? denominationPrice { get; set; }

        public int? qty { get; set; }

        public int? remainingQty { get; set; }

        public int? unfitQty { get; set; }

        [MaxLength(5)]
        public string? cbBdcCode { get; set; }

        public string? bankCode { get; set; }
        public string? cashCenterCode { get; set; }
        public string? cashCenterName { get; set; }

        public bool hasCrossMachineConflict { get; set; } = false;

        public string CrossMachineConflictMachines { get; set; }
         
    }
}
