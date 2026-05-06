namespace BSS_API.Models.Report.Preparation
{
    using Core.Constants;
    
    public class PreparationUnsortCCReportRequest
    {
        public int? MachineId { get; set; }

        public int DepartmentId { get; set; }

        public long[] PreparationIds { get; set; }

        public string BssBnTypeCode { get; set; } = BssBNTypeCodeConstants.UnsortCC;
    }
}
