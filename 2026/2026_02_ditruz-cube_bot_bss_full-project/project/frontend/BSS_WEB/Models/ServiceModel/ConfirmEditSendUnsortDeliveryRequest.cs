namespace BSS_WEB.Models.ServiceModel
{
    public class ConfirmEditSendUnsortDeliveryRequest
    {
        public long SendUnsortId { get; set; }

        public string SendUnsortCode { get; set; }

        public int StatusId { get; set; }

        public int DepartmentId { get; set; }

        public int UserId { get; set; }

        public ICollection<ConfirmEditSendUnsortDataResponse> SendUnsortData { get; set; } =
            new List<ConfirmEditSendUnsortDataResponse>();
    }

    public class ConfirmEditSendUnsortDataResponse
    {
        public long? SendDataId { get; set; }

        public long? SendUnsortId { get; set; }

        public long RegisterUnsortId { get; set; }

        public string ContainerCode { get; set; } // บาร์โค้ดภาชนะ

        public DateTime? CreatedDate { get; set; } // วันที่ลงทะเบียน

        public int StatusId { get; set; }

        public string? StatusName { get; set; }

        public bool CanEdit { get; set; } = false;

        public bool IsOldData { get; set; } = false;

        public bool IsSelected { get; set; } = false;

        public ICollection<ConfirmEditSendUnsortDeliveryUnsortCCResponseDetail> UnsortCC { get; set; } =
            new List<ConfirmEditSendUnsortDeliveryUnsortCCResponseDetail>();
    }

    public class ConfirmEditSendUnsortDeliveryUnsortCCResponseDetail
    {
        public long UnsortCCId { get; set; }

        public int InstId { get; set; }

        public string InstNameTh { get; set; }

        public int DenoId { get; set; }

        public string DenoPrice { get; set; }

        public int BankNoteQty { get; set; }

        public DateTime CreatedDate { get; set; }

        public bool IsActive { get; set; }

        public bool CanEdit { get; set; } = false;

        public bool CanDelete { get; set; } = false;
    }
}
