namespace BSS_WEB.Models.ObjectModel
{
    public class RegisterUnsortCCDataResponse
    {
        public long unsortCCId { get; set; }
        public long registerUnsortId { get; set; }
        public int instId { get; set; }
        public string? instNameTh { get; set; }
        public int denoId { get; set; }
        public string? denoName { get; set; }
        public int banknoteQty { get; set; }
        public int remainingQty { get; set; }
        public int? adjustQty { get; set; }
        public bool isActive { get; set; }
        public int? createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public int? updatedBy { get; set; }
        public DateTime? updatedDate { get; set; }
        public bool canEdit { get; set; }
        public bool canDelete { get; set; }
    }
}
