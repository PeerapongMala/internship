namespace BSS_API.Models.Report.RegisterUnsort
{
    using Core.Constants;

    public class RegisterUnsortReportModel
    {
        public string ReportTitle { get; set; } = BssReportConstants.RegisterUnsortReportName;

        public RegisterUnsortReportHeader ReportHeader { get; set; } = new();

        public ICollection<RegisterUnsortReportDetail> ReportDetail { get; set; } =
            new List<RegisterUnsortReportDetail>();

        public RegisterUnsortReportSummary ReportSummary { get; set; } = new();
    }

    public class RegisterUnsortReportHeader
    {
        public string BarcodeContainer { get; set; }

        public string RegisterDate { get; set; }

        public string OperatorName { get; set; }

        public string DepartmentName { get; set; }
    }

    public class RegisterUnsortReportDetail
    {
        public string InstitutionName { get; set; }

        public string DenominationPrice { get; set; }

        public int TotalBundle { get; set; }

        public string CreatedDate { get; set; }

        public string CreatedName { get; set; }
    }

    public class RegisterUnsortReportSummary
    {
        public string BarcodeContainer { get; set; }

        public int TotalAllBundle { get; set; }

        public int TotalAllInstitution { get; set; }
    }
}