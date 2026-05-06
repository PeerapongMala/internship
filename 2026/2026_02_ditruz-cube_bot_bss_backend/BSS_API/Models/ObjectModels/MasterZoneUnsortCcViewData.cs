namespace BSS_API.Models.ObjectModels
{
    public class MasterCashPointUnsortCcViewData
    {
        public string BranchCode { get; set; }
        public string? CashpointName { get; set; }
        public int CashpointId { get; set; }
        public string ZoneCode { get; set; }
        public int DepartmentId { get; set; }
        public string? CbBcdCode { get; set; }
    }

    public class MasterZoneUnsortCcViewData
    {
        public long ZoneId { get; set; }
        public string? ZoneName { get; set; }
        public string ZoneCode { get; set; }
        public int DepartmentId { get; set; }
        public string? CbBcdCode { get; set; }
    }

    public class MasterDenoUnsortCcViewData
    {
        public int DenoId { get; set; }
        public int? DenoPrice { get; set; }
    }
}