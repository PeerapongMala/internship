
namespace BSS_API.Models.RequestModels
{
    public class TransactionContainerPrepareViewData
    {
        public long ContainerPrepareId { get; set; } 

        public int DepartmentId { get; set; }

        public int? MachineId { get; set; }

        public string ContainerCode { get; set; }

        public long? ReceiveId { get; set; }

        public long? RegisterUnsortId { get; set; } 

        public int BntypeId { get; set; }

        public bool? IsActive { get; set; } 

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}
