namespace BSS_WEB.Models.ObjectModel
{
    public class UnsortCCResponse
    {
        public long UnsortCCId { get; set; }
        public long RegisterUnsortId { get; set; }
        public string InstNameTh { get; set; }
        public decimal DenoPrice { get; set; }
        public int BanknoteType { get; set; }
        public int BanknoteQty { get; set; }
        public int RemainingQty { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
