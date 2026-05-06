namespace BSS_API.Models.RequestModels
{
    public class ConfirmRegisterUnsortDeliverRequest
    {
        public int CreatedBy { get; set; }

        public int CompanyId { get; set; }

        public int DepartmentId { get; set; }

        public ICollection<ConfirmRegisterUnsortDeliver> RegisterSendUnsortCC { get; set; } =
            new List<ConfirmRegisterUnsortDeliver>();
    }

    public class ConfirmRegisterUnsortDeliver
    {
        public long SendUnsortId { get; set; }

        public int DepartmentId { get; set; }

        public string SendUnsortCode { get; set; }

        public string? Remark { get; set; }

        public string? RefCode { get; set; }

        public string? OldRefCode { get; set; }

        public int StatusId { get; set; }

        public DateTime? SendDate { get; set; }

        public DateTime? ReceiveDate { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }
    }
}