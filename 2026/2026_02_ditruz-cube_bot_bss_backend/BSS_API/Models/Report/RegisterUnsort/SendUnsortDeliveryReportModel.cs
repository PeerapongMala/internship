namespace BSS_API.Models.Report.RegisterUnsort
{
    using Core.Constants;

    public class SendUnsortDeliveryReportModel
    {
        public string ReportTitle { get; set; } = BssReportConstants.SendUnsortDeliveryReportName;

        public SendUnsortDeliveryReportHeader ReportHeader { get; set; } = new();

        public ICollection<SendUnsortDeliveryReportDetail> ReportDetail { get; set; } =
            new List<SendUnsortDeliveryReportDetail>();
    }

    public class SendUnsortDeliveryReportHeader
    {
        public string SendUnsortCode { get; set; }

        public string PrintDate { get; set; }

        public string SupervisorName { get; set; }

        public string RefCode { get; set; }

        public string DepartmentName { get; set; }
    }

    public class SendUnsortDeliveryReportDetail
    {
        public string ContainerCode { get; set; }

        public string InstitutionName { get; set; }

        public string DenominationPrice { get; set; }

        public int TotalBundle { get; set; }
    }
}