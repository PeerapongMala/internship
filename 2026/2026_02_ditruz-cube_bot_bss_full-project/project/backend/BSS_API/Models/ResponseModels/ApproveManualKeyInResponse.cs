namespace BSS_API.Models.ResponseModels
{
  /// <summary>
  /// Response model for manual key-in approval list item
  /// </summary>
  public class ManualKeyInApprovalListResponse
  {
    public long HeaderCardId { get; set; }
    public string HeaderCardCode { get; set; } = string.Empty;
    public string BnTypeName { get; set; } = string.Empty;
    public int BnTypeId { get; set; }
    public DateTime CreateDate { get; set; }
    public string CreatedByName { get; set; } = string.Empty;
    public string MachineName { get; set; } = string.Empty;
    public string ShiftName { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string? Remark { get; set; }
    public int TotalDenominations { get; set; }
    public int TotalQuantity { get; set; }
    public decimal TotalValue { get; set; }
  }

  /// <summary>
  /// Response model for header card denomination details
  /// </summary>
  public class HeaderCardDenominationDetailResponse
  {
    public int DenominationId { get; set; }
    public string DenominationName { get; set; } = string.Empty;
    public decimal DenominationValue { get; set; }
    public string TypeName { get; set; } = string.Empty;
    public string SeriesName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal TotalValue { get; set; }
    public string? ImageUrl { get; set; }
  }

  /// <summary>
  /// Response model for approve action result
  /// </summary>
  public class ApproveManualKeyInResponse
  {
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public long HeaderCardId { get; set; }
    public DateTime? ApprovedDate { get; set; }
  }

  /// <summary>
  /// Response model for deny action result
  /// </summary>
  public class DenyManualKeyInResponse
  {
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public long HeaderCardId { get; set; }
    public DateTime? DeniedDate { get; set; }
  }
}
