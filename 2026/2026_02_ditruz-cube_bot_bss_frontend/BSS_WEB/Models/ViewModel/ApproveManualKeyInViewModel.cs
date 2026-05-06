namespace BSS_WEB.Models.ViewModel
{
  /// <summary>
  /// ViewModel for Approve Manual Key-in page
  /// </summary>
  public class ApproveManualKeyInViewModel
  {
    public string ShiftName { get; set; } = string.Empty;
    public string Supervisor { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string UserFullName { get; set; } = string.Empty;
    public string RoleCode { get; set; } = string.Empty;
    public string CurrentDate { get; set; } = string.Empty;
  }
}
