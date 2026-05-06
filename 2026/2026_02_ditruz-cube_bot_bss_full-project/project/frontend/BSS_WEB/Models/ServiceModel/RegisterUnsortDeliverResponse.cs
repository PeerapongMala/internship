namespace BSS_WEB.Models.ServiceModel
{
    using BSS_WEB.Models.DisplayModel;

    public class RegisterUnsortDeliverResponse
    {
        public bool DataIsHistory { get; set; } = false;

        public ICollection<string> SendUnsortCode { get; set; } = new List<string>();

        public ICollection<MasterInstitutionDisplay?> MasterInstitution { get; set; } = new List<MasterInstitutionDisplay?>();

        public ICollection<MasterStatusDisplay?> MasterStatus { get; set; } = new List<MasterStatusDisplay?>();

        public ICollection<RegisterSendUnsortCCResponse> RegisterSendUnsortCC { get; set; } =
            new List<RegisterSendUnsortCCResponse>();
    }

    public class RegisterSendUnsortCCResponse
    {
        public long? SendUnsortId { get; set; }

        public long? HistorySendUnsortId { get; set; }

        public int DepartmentId { get; set; }

        public string SendUnsortCode { get; set; }

        public string? Remark { get; set; }

        public string RefCode { get; set; }

        public string? OldRefCode { get; set; }

        public int StatusId { get; set; }

        public MasterStatusDisplay? MasterStatus { get; set; }

        public DateTime? SendDate { get; set; }

        public DateTime? ReceiveDate { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime CreatedDate { get; set; }

        public int? UpdatedBy { get; set; }

        public DateTime? UpdatedDate { get; set; }

        #region ActionButton

        public bool CanEdit { get; set; } = false;

        public bool CanPrint { get; set; } = false;

        public bool CanDelete { get; set; } = false;

        #endregion ActionButton

        public ICollection<RegisterUnsortWithSumBankNoteQtyResponse> RegisterUnsortWithSumBankNoteQty { get; set; } =
            new List<RegisterUnsortWithSumBankNoteQtyResponse>();

        public bool IsHistory { get; set; } = false;
    }

    public class RegisterUnsortWithSumBankNoteQtyResponse
    {
        public long SendDataId { get; set; }

        public long SendUnsortId { get; set; }

        public long RegisterUnsortId { get; set; }

        public string? ContainerCode { get; set; }

        public DateTime? CreatedDate { get; set; } // create a date of register unsort

        public int? TotalBanknoteQty { get; set; }

        public ICollection<MasterInstitutionDisplay?>? MasterInstitution { get; set; } = new List<MasterInstitutionDisplay?>();
    }
}
