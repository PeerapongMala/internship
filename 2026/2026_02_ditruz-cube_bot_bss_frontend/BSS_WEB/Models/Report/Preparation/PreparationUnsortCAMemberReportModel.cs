namespace BSS_WEB.Models.Report.Preparation
{
    using BSS_WEB.Core.Constants;

    public class PreparationUnsortCAMemberReportModel
    {
        public string ReportTitle { get; set; } = BssReportConstants.PreparationUnsortCaMemberReportName;

        public PreparationUnsortCAMemberReportHeader ReportHeader { get; set; } = new();

        public ICollection<PreparationUnsortCAMemberReportDetail> ReportDetail { get; set; } = new List<PreparationUnsortCAMemberReportDetail>();

        public PreparationUnsortCAMemberReportSummary ReportSummary { get; set; } = new PreparationUnsortCAMemberReportSummary();
    }

    public class PreparationUnsortCAMemberReportHeader
    {
        public string SupervisorName { get; set; }

        public string RegisterDate { get; set; }

        public string DepartmentName { get; set; }

        public string MachineName { get; set; }
    }

    public class PreparationUnsortCAMemberReportDetail
    {
        public string BarcodeContainer { get; set; }

        public string HeaderCard { get; set; }

        public string InstitutionCode { get; set; }

        public string CashPointName { get; set; }

        public string DenominationPrice { get; set; }

        public string PreparaDateTime { get; set; }

        public string PreparatorName { get; set; }
    }

    public class PreparationUnsortCAMemberReportSummary
    {
        public int TotalAllBundle { get; set; }

        public int TotalAllInstitution { get; set; }
        public ICollection<PreparationUnsortCAMemberReportSummaryDetail> ReportSummaryDetail { get; set; } = new List<PreparationUnsortCAMemberReportSummaryDetail>();
    }

    public class PreparationUnsortCAMemberReportSummaryDetail
    {
        public string BarcodeContainer { get; set; }
        public int TotalBundle { get; set; }
        public int TotalInstitution { get; set; }

    }
}
