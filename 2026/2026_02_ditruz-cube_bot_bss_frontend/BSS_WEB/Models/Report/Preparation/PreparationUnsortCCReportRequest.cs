using BSS_WEB.Core.Constants;

namespace BSS_WEB.Models.Report.Preparation
{
    public class PreparationUnsortCCReportRequest
    {
        public int? MachineId { get; set; }

        public int DepartmentId { get; set; }

        public long[] PreparationIds { get; set; }

        public string BssBnTypeCode { get; set; } = BssBNTypeCodeConstants.UnsortCC;
    }
}
