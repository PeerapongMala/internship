namespace BSS_WEB.Models.Report.Preparation
{
    using BSS_WEB.Core.Constants;

    public class PreparationUnsortCCReportModel
    {
        public string ReportTitle { get; set; } = BssReportConstants.PreparationUnsortCaNonMemberReportName;

        public PreparationUnsortCCReportHeader ReportHeader { get; set; } = new();

        public ICollection<PreparationUnsortCCReportDetail> ReportDetail { get; set; } = new List<PreparationUnsortCCReportDetail>();

        public PreparationUnsortCCReportSummary ReportSummary { get; set; } = new PreparationUnsortCCReportSummary();
    }

    public class PreparationUnsortCCReportHeader
    {
        public string SupervisorName { get; set; }

        public string RegisterDate { get; set; }

        public string DepartmentName { get; set; }

        public string MachineName { get; set; }
    }

    public class PreparationUnsortCCReportDetail
    {
        public string BarcodeContainer { get; set; }

        public string HeaderCard { get; set; }

        public string InstitutionCode { get; set; }

        public string CashPointName { get; set; }

        public string DenominationPrice { get; set; }

        public string PreparaDateTime { get; set; }

        public string PreparatorName { get; set; }
    }

    public class PreparationUnsortCCReportSummary
    {
        public int TotalAllBundle { get; set; }

        public int TotalAllInstitution { get; set; }
        public ICollection<PreparationUnsortCCReportSummaryDetail> ReportSummaryDetail { get; set; } = new List<PreparationUnsortCCReportSummaryDetail>();
    }

    public class PreparationUnsortCCReportSummaryDetail
    {
        public string BarcodeContainer { get; set; }
        public int TotalBundle { get; set; }
        public int TotalInstitution { get; set; }

    }
}
