using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ServiceModel.Preparation
{
    public class UpdateTransactionContainerPrepareRequest
    {
        [Required]
        public long containerPrepareId { get; set; }

        [Required]
        public int departmentId { get; set; }

        public int? machineId { get; set; }

        [Required]
        [MaxLength(10)]
        public string containerCode { get; set; }

        public long? receiveId { get; set; }

        public long? registerUnsortId { get; set; }

        [Required]
        public int bntypeId { get; set; }

        public bool? isActive { get; set; }

        public int? updatedBy { get; set; }
    }
}
