namespace BSS_WEB.Models.ServiceModel
{
    public class RegisterUnsortCCResult
    {
        public long UnsortCCId { get; set; }
        public long RegisterUnsortId { get; set; }
        public int InstId { get; set; }
        public string InstNameTh { get; set; }
        public int DenoId { get; set; }
        public int DenoName { get; set; }
        public int BanknoteQty { get; set; }
        public int RemainingQty { get; set; }
        public int? AdjustQty { get; set; } 
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool CanEdit { get; set; } = false;
        public bool CanDelete { get; set; } = false;
    }
}
