using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel
{
    public class ExistingTransactionContainerPrepareRequest
    {
        public long ReceiveId { get; set; }

        public int InstitutionId { get; set; }

        public int DenominationId { get; set; }

        public int CashCenterId { get; set; }
    }
}
