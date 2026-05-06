using BSS_WEB.Models.Report.Preparation;
using BSS_WEB.Models.Report.RegisterUnsort;
using ClosedXML.Excel;

namespace BSS_WEB.Interfaces
{
    public interface IBssExcelExportService
    {
        XLWorkbook? ExportPreparationUnfitToWorkbook(PreparationUnfitReportModel preparationUnfitReportRequest);

        XLWorkbook? ExportPreparationUnsortCAMemberToWorkbook(PreparationUnsortCAMemberReportModel preparationUnsortCAMemberReportModel);

        XLWorkbook? ExportPreparationUnsortCANonMemberToWorkbook(PreparationUnsortCANonMemberReportModel preparationUnsortCANonMemberReportModel);

        XLWorkbook? ExportPreparationUnsortCCToWorkbook(PreparationUnsortCCReportModel preparationUnsortCCReportModel);

        XLWorkbook? ExportRegisterUnsortToWorkbook(RegisterUnsortReportModel registerUnsortReportModel);

        XLWorkbook? ExportSendUnsortDeliveryToWorkbook(SendUnsortDeliveryReportModel sendUnsortDeliveryReportModel);
    }
}