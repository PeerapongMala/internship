namespace BSS_WEB.Models.DisplayModel;

public class TransactionContainerPrepareDisplay
{
    public long ContainerPrepareId { get; set; }

    public int DepartmentId { get; set; }

    public int? MachineId { get; set; }

    public required string ContainerCode { get; set; }

    public long? ReceiveId { get; set; }

    public ReceiveCbmsDataTransactionDisplay? ReceiveCbmsDataTransaction { get; set; }

    public int BntypeId { get; set; }

    public bool? IsActive { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime CreatedDate { get; set; }

    public int? UpdatedBy { get; set; }

    public DateTime? UpdatedDate { get; set; }
    public List<TransactionPreparationDisplay>? TransactionPreparation { get; set; }
}
