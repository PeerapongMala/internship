namespace BSS_WEB.Models.Report.Preparation
{
    using BSS_WEB.Core.Constants;

    public class PreparationUnfitReportModel
    {
        public string ReportTitle { get; set; } = BssReportConstants.PreparationUnfitReportName;

        public PreparationUnfitReportHeader ReportHeader { get; set; } = new();

        public ICollection<PreparationUnfitReportDetail> ReportDetail { get; set; } = new List<PreparationUnfitReportDetail>();

        public PreparationUnfitReportSummary ReportSummary { get; set; } = new PreparationUnfitReportSummary();
    }

    public class PreparationUnfitReportHeader 
    {
        public string SupervisorName { get; set; }

        public string RegisterDate { get; set; }

        public string DepartmentName { get; set; }

        public string MachineName { get; set; }
    }

    public class PreparationUnfitReportDetail 
    {
        public string BarcodeContainer { get; set; }

        public string BarcodeWrap { get; set; }
        public string BarcodeWrapImage { get; set; }

        public string BarcodeBundle { get; set; }
        public string BarcodeBundleImage { get; set; }

        public string HeaderCard { get; set; }

        public string InstitutionCode { get; set; }

        public string CashCenterName { get; set; }

        public string DenominationPrice { get; set; }

        public string PreparaDateTime { get; set; }

        public string PreparatorName { get; set; }
    }

    public class PreparationUnfitReportSummary 
    {
        public int TotalAllBundle { get; set; }

        public int TotalAllInstitution { get; set; }
        public ICollection<PreparationUnfitReportSummaryDetail> ReportSummaryDetail { get; set; } = new List<PreparationUnfitReportSummaryDetail>();
    }

    public class PreparationUnfitReportSummaryDetail
    {
        public string BarcodeContainer { get; set; }
        public int TotalBundle { get; set; }
        public int TotalInstitution { get; set; }

    }
}
