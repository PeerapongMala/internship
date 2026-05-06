namespace BSS_API.Models.ResponseModels;

/// <summary>
/// Response รวม 5 ตาราง สำหรับหน้า Auto Selling
/// </summary>
public class AutoSellingAllDataResponse
{
    /// <summary>มัดครบจำนวน ครบมูลค่า</summary>
    public List<AutoSellingItemResponse> Table1 { get; set; } = new();

    /// <summary>มัดรวมครบจำนวน ครบมูลค่า</summary>
    public List<AutoSellingItemResponse> Table2 { get; set; } = new();

    /// <summary>มัดขาด-เกิน</summary>
    public List<AutoSellingItemResponse> TableA { get; set; } = new();

    /// <summary>มัดรวมขาด-เกิน</summary>
    public List<AutoSellingItemResponse> TableB { get; set; } = new();

    /// <summary>มัดเกินจากเครื่องจักร</summary>
    public List<AutoSellingItemResponse> TableC { get; set; } = new();
}

/// <summary>
/// รายการแต่ละแถวในตาราง — ตรงกับ mock data ของ frontend
/// </summary>
public class AutoSellingItemResponse
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

/// <summary>
/// รายละเอียด Header Card (ทำลาย / ดี / Reject)
/// </summary>
public class AutoSellingDetailResponse
{
    public string? HeaderCardCode { get; set; }
    public List<AutoSellingDetailRow> Rows { get; set; } = new();
    public int TotalQty { get; set; }
    public decimal TotalValue { get; set; }
}

public class AutoSellingDetailRow
{
    public string? HeaderCardCode { get; set; }
    public string? Bank { get; set; }
    public string? Cashpoint { get; set; }
    public int DenominationPrice { get; set; }
    public string? Type { get; set; }
    public string? TypeNum { get; set; }
    public int Qty { get; set; }
    public decimal TotalValue { get; set; }
}

/// <summary>
/// Response สำหรับ action ต่าง ๆ (Adjustment, Merge, CancelSend)
/// </summary>
public class AutoSellingActionResponse
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
}

/// <summary>
/// Response สำหรับ ValidateSummary ก่อนส่งไป Verify
/// </summary>
public class AutoSellingValidateSummaryResponse
{
    public bool IsValid { get; set; }
    public string? Message { get; set; }
    public List<long> ValidIds { get; set; } = new();
}
