namespace BSS_API.Models.ObjectModels
{
    public class TransactionContainerPrepareViewDisplay
    {
       
            public long ContainerPrepareId { get; set; }

            // Department
            public int DepartmentId { get; set; }
            public string? DepartmentName { get; set; }

            // Machine
            public int? MachineId { get; set; }
            public string? MachineName { get; set; }

            // Container data
            public string ContainerCode { get; set; }

            // ReceiveCbmsDataTransaction
            public string BnTypeInput { get; set; }
            public string? ContainerId { get; set; }
            public string? BarCode { get; set; }
            public int? Qty { get; set; }
            public int? RemainingQty { get; set; }
            public int? UnfitQty { get; set; }

            // Banknote type
            public int BntypeId { get; set; }
            public string? BanknoteTypeName { get; set; }

            // Register unsort
            public long? RegisterUnsortId { get; set; }
            public bool? IsActive { get; set; }
        

    }
}
