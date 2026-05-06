namespace BSS_WEB.Models.Report.Preparation
{
    using BSS_WEB.Core.Constants;

    public class PreparationUnsortCAMemberReportRequest
    {
        public int? MachineId { get; set; }

        public int DepartmentId { get; set; }

        public long[] PreparationIds { get; set; }

        public string BssBnTypeCode { get; set; } = BssBNTypeCodeConstants.UnsortCAMember;
    }
}
