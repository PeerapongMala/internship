using System.ComponentModel.DataAnnotations;

namespace BSS_API.Models.RequestModels
{
    public class UpdateTransactionContainerPrepareRequest
    {
        [Required]
        public long ContainerPrepareId { get; set; }

        [Required]
        public int DepartmentId { get; set; }

        public int? MachineId { get; set; }

        [Required]
        [MaxLength(10)]
        public string ContainerCode { get; set; }

        public long? ReceiveId { get; set; }

        public long? RegisterUnsortId { get; set; }

        [Required]
        public int BntypeId { get; set; }

        public bool? IsReconcile { get; set; }

        public bool? IsActive { get; set; }

        public int? UpdatedBy { get; set; }
    }
}
