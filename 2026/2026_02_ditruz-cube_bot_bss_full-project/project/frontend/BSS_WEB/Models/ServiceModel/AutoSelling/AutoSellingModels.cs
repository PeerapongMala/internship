namespace BSS_WEB.Models.ServiceModel.AutoSelling
{
    // ── Filter ──

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

    // ── Results ──

    public class AutoSellingAllDataResult
    {
        public List<AutoSellingItemResult> Table1 { get; set; } = new();
        public List<AutoSellingItemResult> Table2 { get; set; } = new();
        public List<AutoSellingItemResult> TableA { get; set; } = new();
        public List<AutoSellingItemResult> TableB { get; set; } = new();
        public List<AutoSellingItemResult> TableC { get; set; } = new();
    }

    public class AutoSellingItemResult
    {
        public long Id { get; set; }
        public string? HeaderCardCode { get; set; }
        public string? Bank { get; set; }
        public string? Zone { get; set; }
        public string? Cashpoint { get; set; }
        public int DenominationPrice { get; set; }
        public DateTime? CountingDate { get; set; }
        public int Qty { get; set; }
        public decimal TotalValue { get; set; }
        public string? Status { get; set; }
        public bool IsEdited { get; set; }
        public int? ExcessQty { get; set; }
        public int? ShiftId { get; set; }
        public string? ShiftName { get; set; }
    }

    public class AutoSellingDetailResult
    {
        public string? HeaderCardCode { get; set; }
        public List<AutoSellingDetailRowResult> Rows { get; set; } = new();
        public int TotalQty { get; set; }
        public decimal TotalValue { get; set; }
    }

    public class AutoSellingDetailRowResult
    {
        public string? HeaderCardCode { get; set; }
        public string? Bank { get; set; }
        public string? Cashpoint { get; set; }
        public int DenominationPrice { get; set; }
        public string? Type { get; set; }
        public int? TypeNum { get; set; }
        public int Qty { get; set; }
        public decimal TotalValue { get; set; }
    }

    public class AutoSellingActionResult
    {
        public bool IsSuccess { get; set; }
        public string? Message { get; set; }
    }

    public class AutoSellingValidateSummaryResult
    {
        public bool IsValid { get; set; }
        public string? Message { get; set; }
        public List<long> ValidIds { get; set; } = new();
    }

    // ── Request DTOs ──

    public class AutoSellingAdjustmentRequest
    {
        public long Id { get; set; }
        public string HeaderCardCode { get; set; } = string.Empty;
        public string Direction { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public int Qty { get; set; }
        public string? Remark { get; set; }
        public int? DenominationPrice { get; set; }
        public string? SeriesDenomCode { get; set; }
        public string AdjustType { get; set; } = string.Empty;
        public bool IsMachineResult { get; set; }
        public bool IsAddon { get; set; }
        public bool IsEndjam { get; set; }
    }

    public class AutoSellingMergeRequest
    {
        public long KeepId { get; set; }
        public long MergeId { get; set; }
    }

    public class AutoSellingCancelSendRequest
    {
        public List<long> Ids { get; set; } = new();
        public int ManagerId { get; set; }
        public string Otp { get; set; } = string.Empty;
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
    }

    public class AdjustOffsetRequest
    {
        public List<long> Ids { get; set; } = new();
        public int ManagerId { get; set; }
    }

    public class AutoSellingInsertReplaceRequest
    {
        public string HeaderCardCode { get; set; } = string.Empty;
        public List<AutoSellingInsertReplaceRow> Rows { get; set; } = new();
        public string? Remark { get; set; }
        public string Type { get; set; } = "normal";
    }

    public class AutoSellingInsertReplaceRow
    {
        public int Denomination { get; set; }
        public string? TypeNum { get; set; }
        public int Qty { get; set; }
        public string Direction { get; set; } = string.Empty;
    }
}
