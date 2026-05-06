namespace BSS_API.Models.ResponseModels
{
    public class ContainerBySendUnsortIdResponse
    {
        public long SendUnsortId { get; set; }
        public string SendUnsortCode { get; set; }
        public long RegisterUnsortId { get; set; }
        public string ContainerCode { get; set; }
        public int BanknoteQty { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public bool CanEdit { get; set; } = false;
        public bool CanDelete { get; set; } = false;

        public ICollection<UnsortCCReceiveResponse> UnsortCCReceiveData { get; set; }
    }
}
