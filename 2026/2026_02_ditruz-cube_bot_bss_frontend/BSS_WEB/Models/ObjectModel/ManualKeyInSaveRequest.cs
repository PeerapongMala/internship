using System.ComponentModel.DataAnnotations;

namespace BSS_WEB.Models.ObjectModel;

public class ManualKeyInSaveRequest
{
    [Required]
    [Range(1, long.MaxValue)]
    public long PrepareId { get; set; }

    [Required]
    [StringLength(50)]
    public string HeaderCardCode { get; set; } = string.Empty;

    [Range(1, int.MaxValue)]
    public int DepartmentId { get; set; }

    public int MachineHdId { get; set; }
    public int ShiftId { get; set; }
    public int? SorterId { get; set; }
    public int CreatedBy { get; set; }

    [Required]
    [MinLength(1)]
    public List<ManualKeyInItemRequest> Items { get; set; } = new();
}

public class ManualKeyInItemRequest
{
    [Range(1, int.MaxValue)]
    public int Denom { get; set; }

    [Required]
    public string Type { get; set; } = string.Empty;

    [Required]
    public string Series { get; set; } = string.Empty;

    [Range(0, int.MaxValue)]
    public int BeforeQty { get; set; }

    [Range(0, int.MaxValue)]
    public int AfterQty { get; set; }

    public bool IsChanged { get; set; }
}
