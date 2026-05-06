using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel;

public class ManualKeyInSubmitRequest
{
    [Required]
    [Range(1, long.MaxValue)]
    public long ReconcileTranId { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int SupervisorId { get; set; }

    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string OtpCode { get; set; } = string.Empty;

    public int UpdatedBy { get; set; }

    [StringLength(500)]
    public string? Remark { get; set; }

    [StringLength(100)]
    public string? RefDocNo { get; set; }
}
