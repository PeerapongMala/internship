namespace BSS_WEB.Models.ServiceModel.ManualKeyIn
{
    public class ManualKeyInDenominationResult
    {
        public List<ManualKeyInDenominationItem> Items { get; set; } = new();
        public int TotalBeforeQty { get; set; }
        public int TotalAfterQty { get; set; }
    }

    public class ManualKeyInDenominationItem
    {
        public int Denom { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Series { get; set; } = string.Empty;
        public int BeforeQty { get; set; }
        public int AfterQty { get; set; }
        public bool IsChanged { get; set; }
    }
}
