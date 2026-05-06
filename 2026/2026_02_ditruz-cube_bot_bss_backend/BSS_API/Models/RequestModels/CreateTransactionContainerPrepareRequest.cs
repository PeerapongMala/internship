using BSS_API.Models.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BSS_API.Models.RequestModels
{
    public class CreateTransactionContainerPrepareRequest
    {


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

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

       
    }
}
