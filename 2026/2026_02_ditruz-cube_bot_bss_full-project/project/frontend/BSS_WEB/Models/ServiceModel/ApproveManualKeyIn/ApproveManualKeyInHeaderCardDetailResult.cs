namespace BSS_WEB.Models.ServiceModel.ApproveManualKeyIn
{
    public class ApproveManualKeyInHeaderCardDetailResult
    {
        public long ApproveManualKeyInTranId { get; set; }
        public string? HeaderCardCode { get; set; }
        public DateTime? Date { get; set; }
        public string? SorterName { get; set; }
        public string? ApproverName { get; set; }
        public string? SortingMachineName { get; set; }
        public string? ShiftName { get; set; }
    }
}
