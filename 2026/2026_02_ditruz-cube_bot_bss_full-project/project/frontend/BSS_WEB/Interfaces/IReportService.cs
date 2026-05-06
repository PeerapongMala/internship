namespace BSS_WEB.Interfaces
{
    using BSS_WEB.Models.Report;
    using BSS_WEB.Models.Report.Preparation;
    using BSS_WEB.Models.Report.RegisterUnsort;
    using BSS_WEB.Models.ServiceModel;

    public interface IReportService
    {
        Task<BaseApiResponse<bool>> CheckSupervisorOnlineAsync(CheckSupervisorOnlineRequest checkSupervisorOnlineRequest);

        Task<BaseApiResponse<PreparationUnfitReportModel>> PreparationUnfitReportAsync(PreparationUnfitReportRequest preparationUnfitReportRequest);

        Task<BaseApiResponse<PreparationUnsortCAMemberReportModel>> PreparationUnsortCAMemberReportAsync(PreparationUnsortCAMemberReportRequest preparationUnsortCAMemberReportRequest);

        Task<BaseApiResponse<PreparationUnsortCANonMemberReportModel>> PreparationUnsortCANonMemberReportAsync(PreparationUnsortCANonMemberReportRequest preparationUnsortCANonMemberReportRequest);

        Task<BaseApiResponse<PreparationUnsortCCReportModel>> PreparationUnsortCCReportAsync(PreparationUnsortCCReportRequest preparationUnsortCCReportRequest);

        Task<BaseApiResponse<RegisterUnsortReportModel>> RegisterUnsortCCReportAsync(RegisterUnsortReportRequest registerUnsortReportRequest);

        Task<BaseApiResponse<SendUnsortDeliveryReportModel>> SendUnsortDeliveryReportAsync(SendUnsortDeliveryRequest sendUnsortDeliveryRequest);

        Task<BaseApiResponse<reportBankSummaryResponse>> BankSummaryReportAsync(reportBankSummaryRequest request);
        Task<BaseApiResponse<reportCashPointCenterResponse>> CashPointCenterReportAsync(reportCashPointCenterRequest request);

        // เพิ่ม Method สำหรับดึงรายการ Header Card ตาม Filter
        Task<BaseApiResponse<List<HeaderCardListResponse>>> GetHeaderCardListAsync(HeaderCardListRequest request);

        Task<BaseApiResponse<reportSingleHeaderCardResponse>> SingleHeaderCardReportAsync(reportSingleHeaderCardRequest request);
        Task<BaseApiResponse<reportMultiHeaderCardResponse>> MultiHeaderCardReportAsync(reportMultiHeaderCardRequest request);
        Task<BaseApiResponse<reportContainerResponse>> ContainerReportAsync(reportContainerRequest request);
        Task<BaseApiResponse<reportAbnormalResponse>> AbnormalReportAsync(reportAbnormalRequest request);

    }
}
