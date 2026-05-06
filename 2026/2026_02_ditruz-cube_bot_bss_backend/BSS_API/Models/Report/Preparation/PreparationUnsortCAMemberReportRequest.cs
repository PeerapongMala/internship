namespace BSS_API.Models.Report.Preparation
{
    using Core.Constants;
    
    public class PreparationUnsortCAMemberReportRequest
    {
        public int? MachineId { get; set; }

        public int DepartmentId { get; set; }

        public long[] PreparationIds { get; set; }

        public string BssBnTypeCode { get; set; } = BssBNTypeCodeConstants.UnsortCAMember;
    }
}
