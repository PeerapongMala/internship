namespace BSS_WEB.Models.ServiceModel
{
    public class RegisterUnsortResult
    {
        public long RegisterUnsortId { get; set; }

        public string ContainerCode { get; set; }

        public int? DepartmentId { get; set; }

        public bool? IsActive { get; set; }

        public int StatusId { get; set; }

        public string StatusNameTh { get; set; }

        public DateTime? ReceivedDate { get; set; }

        public string Remark { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
        public string? CreatedByName { get; set; }
        public string? UpdatedByName { get; set; }

        /// <Flag>
        public bool CanEdit { get; set; } = false;

        public bool CanPrint { get; set; } = false;
        public bool CanDelete { get; set; } = false;

        public ICollection<RegisterUnsortCCResult> UnsortCC { get; set; }
    }
}
