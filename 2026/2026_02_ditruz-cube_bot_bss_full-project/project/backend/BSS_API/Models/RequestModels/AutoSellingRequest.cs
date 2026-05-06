namespace BSS_API.Models.RequestModels;

public class AutoSellingFilterRequest
{
    public int DepartmentId { get; set; }
    public int? BnTypeId { get; set; }
    public int? MachineId { get; set; }
    public int? ShiftId { get; set; }
    public string? HeaderCardCode { get; set; }
    public int? DenominationPrice { get; set; }
    public string? Bank { get; set; }
    public string? Zone { get; set; }
    public string? Cashpoint { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public bool IsActive { get; set; } = true;
}

public class AutoSellingAdjustmentRequest
{
    public long Id { get; set; }
    public string HeaderCardCode { get; set; } = string.Empty;
    public string Direction { get; set; } = string.Empty;   // "add" | "subtract"
    public string Type { get; set; } = string.Empty;        // "normal" | "addon" | "entjam"
    public int Qty { get; set; }
    public string? Remark { get; set; }
    public int? DenominationPrice { get; set; }
    public string? SeriesDenomCode { get; set; }
    public string AdjustType { get; set; } = string.Empty;  // "ADD" | "DEC"
    public bool IsMachineResult { get; set; }
    public bool IsAddon { get; set; }
    public bool IsEndjam { get; set; }
    public int? UpdatedBy { get; set; }
}

public class AutoSellingMergeRequest
{
    public long KeepId { get; set; }
    public long MergeId { get; set; }
    public int? UpdatedBy { get; set; }
}

public class AutoSellingCancelSendRequest
{
    public List<long> Ids { get; set; } = new();
    public int ManagerId { get; set; }
    public string Otp { get; set; } = string.Empty;
    public int? UpdatedBy { get; set; }
}

public class AutoSellingValidateSummaryRequest
{
    public List<long> SelectedIds { get; set; } = new();
}

public class AutoSellingChangeShiftRequest
{
    public List<long> Ids { get; set; } = new();
    public int ShiftId { get; set; }
    public int ManagerId { get; set; }
    public int? UpdatedBy { get; set; }
}

public class AdjustOffsetRequest
{
    public List<long> Ids { get; set; } = new();
    public int ManagerId { get; set; }
    public int? UpdatedBy { get; set; }
}

public class AutoSellingInsertReplaceRequest
{
    public string HeaderCardCode { get; set; } = string.Empty;
    public List<AutoSellingInsertReplaceRow> Rows { get; set; } = new();
    public string? Remark { get; set; }
    public string Type { get; set; } = "normal";  // "normal" | "addon" | "endjam"
    public int? UpdatedBy { get; set; }
}

public class AutoSellingInsertReplaceRow
{
    public int Denomination { get; set; }
    public string? TypeNum { get; set; }
    public int Qty { get; set; }
    public string Direction { get; set; } = string.Empty;  // "add" | "subtract"
}
