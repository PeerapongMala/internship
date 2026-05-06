namespace BSS_API.Models.Report.Preparation
{
    using Core.Constants;

    public class PreparationUnsortCANonMemberReportModel
    {
        public string ReportTitle { get; set; } = BssReportConstants.PreparationUnsortCaNonMemberReportName;

        public PreparationUnsortCANonMemberReportHeader ReportHeader { get; set; } = new();

        public ICollection<PreparationUnsortCANonMemberReportDetail> ReportDetail { get; set; } =
            new List<PreparationUnsortCANonMemberReportDetail>();

        public PreparationUnsortCANonMemberReportSummary ReportSummary { get; set; } =
            new PreparationUnsortCANonMemberReportSummary();
    }

    public class PreparationUnsortCANonMemberReportHeader
    {
        public string SupervisorName { get; set; }

        public string RegisterDate { get; set; }

        public string DepartmentName { get; set; }

        public string MachineName { get; set; }
    }

    public class PreparationUnsortCANonMemberReportDetail
    {
        public string BarcodeContainer { get; set; }

        public string HeaderCard { get; set; }

        public string InstitutionCode { get; set; }

        public string CashCenterName { get; set; }

        public string DenominationPrice { get; set; }

        public string PreparaDateTime { get; set; }

        public string PreparatorName { get; set; }
    }

    public class PreparationUnsortCANonMemberReportSummary
    {
        public int TotalAllBundle { get; set; }

        public int TotalAllInstitution { get; set; }

        public ICollection<PreparationUnsortCANonMemberReportSummaryDetail> ReportSummaryDetail { get; set; } =
            new List<PreparationUnsortCANonMemberReportSummaryDetail>();
    }

    public class PreparationUnsortCANonMemberReportSummaryDetail
    {
        public string BarcodeContainer { get; set; }
        public int TotalBundle { get; set; }
        public int TotalInstitution { get; set; }
    }
}