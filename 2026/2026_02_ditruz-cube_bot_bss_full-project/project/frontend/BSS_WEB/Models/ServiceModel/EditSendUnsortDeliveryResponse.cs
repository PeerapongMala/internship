namespace BSS_WEB.Models.ServiceModel
{
    public class EditSendUnsortDeliveryResponse
    {
        public long SendUnsortId { get; set; }

        public string SendUnsortCode { get; set; }

        public int StatusId { get; set; }

        public List<string> BarcodeContainer { get; set; } = new();

        public ICollection<SendUnsortDataResponse> SendUnsortData { get; set; } = new List<SendUnsortDataResponse>();
    }

    public class SendUnsortDataResponse
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

        public ICollection<EditSendUnsortDeliveryUnsortCCResponseDetail> UnsortCC { get; set; } =
            new List<EditSendUnsortDeliveryUnsortCCResponseDetail>();
    }

    public class EditSendUnsortDeliveryUnsortCCResponseDetail
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
