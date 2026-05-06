using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class TransactionContainerPrepareViewData
    {
        public long containerPrepareId { get; set; }

        // Department
        public int departmentId { get; set; }
        public string? departmentName { get; set; }

        // Machine
        public int? machineId { get; set; }
        public string? machineName { get; set; }

        // Container data
        public string? containerCode { get; set; }

        // ReceiveCbmsDataTransaction
        public string? bnTypeInput { get; set; }
        public string? containerId { get; set; }
        public string? barCode { get; set; }
        public int qty { get; set; }
        public int remainingQty { get; set; }
        public int unfitQty { get; set; }

        // Banknote type
        public int bntypeId { get; set; }
        public string? banknoteTypeName { get; set; }

        // Register unsort
        public long? registerUnsortId { get; set; }
        public string? registerUnsortContainer { get; set; }

        public bool? isActive { get; set; }

    }
}
