using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class ExistingTransactionContainerPrepareRequest
    {
        [Required]
        public long ReceiveId { get; set; }

        /// <summary>
        /// primary ของธนาคาร
        /// </summary>
        [Required]
        public int InstitutionId { get; set; }

        /// <summary>
        /// primary ชนิดราคา
        /// </summary>
        [Required]
        public int DenominationId { get; set; }

        /// <summary>
        /// primary ศูนย์เงินสด
        /// </summary>
        [Required]
        public int CashCenterId { get; set; }
    }
}
