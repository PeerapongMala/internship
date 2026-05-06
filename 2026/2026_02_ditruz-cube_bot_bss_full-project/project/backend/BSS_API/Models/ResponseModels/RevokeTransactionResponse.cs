namespace BSS_API.Models.ResponseModels;

public class RevokeTransactionResponse
{
    public long ReconcileTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public int DepartmentId { get; set; }

    // JOIN fields from TransactionPreparation
    public string? Bank { get; set; }
    public string? CashCenter { get; set; }
    public string? Zone { get; set; }
    public string? Cashpoint { get; set; }
    public int? DenominationPrice { get; set; }

    // JOIN fields from TransactionPreparation (package_code, bundle_code)
    public string? ParentBarcode { get; set; }
    public string? BundleBarcode { get; set; }

    // Reconcile tran fields
    public int? ReconcileQty { get; set; }
    public int? ReconcileTotalValue { get; set; }
    public int StatusId { get; set; }
    public string? StatusName { get; set; }
    public int ShiftId { get; set; }
    public string? ShiftName { get; set; }
    public DateTime? PrepareDate { get; set; }
    public DateTime CreatedDate { get; set; }

    // Denomination breakdown
    public List<RevokeDenominationDetail>? Denominations { get; set; }
}

public class RevokeDetailResponse
{
    public long ReconcileTranId { get; set; }
    public string? HeaderCardCode { get; set; }
    public string? Bank { get; set; }
    public string? Cashpoint { get; set; }
    public int? DenominationPrice { get; set; }
    public List<RevokeDenominationDetail> Rows { get; set; } = new();
    public int TotalQty { get; set; }
    public int TotalValue { get; set; }
}

public class RevokeDenominationDetail
{
    public long ReconcileId { get; set; }
    public string? BnType { get; set; }
    public string? DenomSeries { get; set; }
    public int DenoPrice { get; set; }
    public int Qty { get; set; }
    public int TotalValue { get; set; }
}
