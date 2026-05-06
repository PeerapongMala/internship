namespace BSS_API.Models.RequestModels;

public class ManualKeyInSaveRequest
{
    public long PrepareId { get; set; }
    public string HeaderCardCode { get; set; } = string.Empty;
    public int DepartmentId { get; set; }
    public int MachineHdId { get; set; }
    public int ShiftId { get; set; }
    public int? SorterId { get; set; }
    public int CreatedBy { get; set; }
    public List<ManualKeyInItemRequest> Items { get; set; } = new();
}

public class ManualKeyInItemRequest
{
    public int Denom { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Series { get; set; } = string.Empty;
    public int BeforeQty { get; set; }
    public int AfterQty { get; set; }
    public bool IsChanged { get; set; }
}
