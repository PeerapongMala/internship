namespace BSS_API.Models.RequestModels
{
  /// <summary>
  /// Request model for getting list of transactions awaiting manual key-in approval
  /// </summary>
  public class GetManualKeyInApprovalListRequest
  {
    public string? HeaderCardCode { get; set; }
    public int? StatusId { get; set; }
    public int? ShiftId { get; set; }
    public int? MachineId { get; set; }
    public int? UserId { get; set; }
    public int? BnTypeId { get; set; }
    public DateTime? DateFrom { get; set; }
    public DateTime? DateTo { get; set; }
  }

  /// <summary>
  /// Request model for approving manual key-in transaction
  /// </summary>
  public class ApproveManualKeyInRequest
  {
    public long HeaderCardId { get; set; }
    public string? Remark { get; set; }
    public int ApprovedBy { get; set; }
  }

  /// <summary>
  /// Request model for denying manual key-in transaction
  /// </summary>
  public class DenyManualKeyInRequest
  {
    public long HeaderCardId { get; set; }
    public string Remark { get; set; } = string.Empty;
    public int DeniedBy { get; set; }
  }
}
