namespace BSS_WEB.Models.ObjectModel
{
    public class RegisterUnsortDataResponse
    {
        public long registerUnsortId { get; set; }
        public string? containerCode { get; set; }
        public int? departmentId { get; set; }
        public bool? isActive { get; set; }
        public int statusId { get; set; }
        public string? statusNameTh { get; set; }
        public DateTime? receivedDate { get; set; }
        public string? remark { get; set; }
        public int? createdBy { get; set; }
        public DateTime createdDate { get; set; }
        public int? updatedBy { get; set; }
        public DateTime? updatedDate { get; set; }
        public string? createdByName { get; set; }
        public string? updatedByName { get; set; }
        public bool canEdit { get; set; }
        public bool canPrint { get; set; }
        public bool canDelete { get; set; }
        public List<RegisterUnsortCCDataResponse> unsortCC { get; set; }
    }
}
