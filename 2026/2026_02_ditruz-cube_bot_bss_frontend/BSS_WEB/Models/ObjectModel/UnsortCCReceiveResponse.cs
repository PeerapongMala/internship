namespace BSS_WEB.Models.ObjectModel
{
    public class UnsortCCReceiveResponse
    {
        public long UnsortCCId { get; set; }
        public long RegisterUnsortId { get; set; }
        public string ContainerCode { get; set; }
        public long InstId { get; set; }
        public string InstNameTh { get; set; }
        public string InstShortNameTh { get; set; }
        public long denoId { get; set; }
        public decimal DenoPrice { get; set; }
        public int BanknoteType { get; set; }
        public int BanknoteQty { get; set; }
        public int RemainingQty { get; set; }
        public int AdjustQty { get; set; }
        public bool IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool CanEdit { get; set; } = false;
        public bool CanDelete { get; set; } = false;
    }
}