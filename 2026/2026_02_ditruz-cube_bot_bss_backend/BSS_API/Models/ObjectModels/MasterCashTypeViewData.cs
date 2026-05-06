namespace BSS_API.Models.ObjectModels
{
    public class MasterCashTypeViewData
    {
        public int CashTypeId { get; set; }
        public string CashTypeCode { get; set; }
        public string CashTypeName { get; set; }
        public string? CashTypeDesc { get; set; }
        public bool? IsActive { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int? UpdatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
