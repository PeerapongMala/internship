namespace BSS_WEB.Services
{
    using BSS_WEB.Controllers;
    using BSS_WEB.Interfaces;
    using BSS_WEB.Models.Report;
    using BSS_WEB.Models.Report.Preparation;
    using BSS_WEB.Models.Report.RegisterUnsort;
    using BSS_WEB.Models.ServiceModel;

    public class ReportService : BaseApiClient, IReportService
    {
        public ReportService(HttpClient client, ILogger<ReportService> logger, IHttpContextAccessor contextAccessor) : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<bool>> CheckSupervisorOnlineAsync(CheckSupervisorOnlineRequest checkSupervisorOnlineRequest)
        {
            return await SendAsync<BaseApiResponse<bool>>(HttpMethod.Post, $"api/BssReport/CheckSupervisorOnline", checkSupervisorOnlineRequest);
        }

        public async Task<BaseApiResponse<PreparationUnfitReportModel>> PreparationUnfitReportAsync(PreparationUnfitReportRequest preparationUnfitReportRequest)
        {
            return await SendAsync<BaseApiResponse<PreparationUnfitReportModel>>(HttpMethod.Post, $"api/BssReport/PreparationUnfitReport", preparationUnfitReportRequest);
        }

        public async Task<BaseApiResponse<PreparationUnsortCAMemberReportModel>> PreparationUnsortCAMemberReportAsync(PreparationUnsortCAMemberReportRequest preparationUnsortCAMemberReportRequest)
        {
            return await SendAsync<BaseApiResponse<PreparationUnsortCAMemberReportModel>>(HttpMethod.Post, $"api/BssReport/PreparationUnsortCAMemberReport", preparationUnsortCAMemberReportRequest);
        }

        public async Task<BaseApiResponse<PreparationUnsortCANonMemberReportModel>> PreparationUnsortCANonMemberReportAsync(PreparationUnsortCANonMemberReportRequest preparationUnsortCANonMemberReportRequest)
        {
            return await SendAsync<BaseApiResponse<PreparationUnsortCANonMemberReportModel>>(HttpMethod.Post, $"api/BssReport/PreparationUnsortCANonMemberReport", preparationUnsortCANonMemberReportRequest);
        }

        public async Task<BaseApiResponse<PreparationUnsortCCReportModel>> PreparationUnsortCCReportAsync(PreparationUnsortCCReportRequest preparationUnsortCCReportRequest)
        {
            return await SendAsync<BaseApiResponse<PreparationUnsortCCReportModel>>(HttpMethod.Post, $"api/BssReport/PreparationUnsortCCReport", preparationUnsortCCReportRequest);
        }

        public async Task<BaseApiResponse<RegisterUnsortReportModel>> RegisterUnsortCCReportAsync(RegisterUnsortReportRequest registerUnsortReportRequest)
        {
            return await SendAsync<BaseApiResponse<RegisterUnsortReportModel>>(HttpMethod.Post, $"api/BssReport/RegisterUnsortCC", registerUnsortReportRequest);
        }

        public async Task<BaseApiResponse<SendUnsortDeliveryReportModel>> SendUnsortDeliveryReportAsync(SendUnsortDeliveryRequest sendUnsortDeliveryRequest)
        {
            return await SendAsync<BaseApiResponse<SendUnsortDeliveryReportModel>>(HttpMethod.Post, $"api/BssReport/SendUnsortDelivery", sendUnsortDeliveryRequest);
        }

        public async Task<BaseApiResponse<reportBankSummaryResponse>> BankSummaryReportAsync(reportBankSummaryRequest request)
        {
            return await SendAsync<BaseApiResponse<reportBankSummaryResponse>>(HttpMethod.Post, $"api/Report/GetDataReport_BankSummary", request);
        }

        public async Task<BaseApiResponse<reportCashPointCenterResponse>> CashPointCenterReportAsync(reportCashPointCenterRequest request)
        {
            return await SendAsync<BaseApiResponse<reportCashPointCenterResponse>>(HttpMethod.Post, $"api/Report/GetDataReport_CashPointCashCenter", request);
        }

        public async Task<BaseApiResponse<List<HeaderCardListResponse>>> GetHeaderCardListAsync(HeaderCardListRequest request)
        {
            return await SendAsync<BaseApiResponse<List<HeaderCardListResponse>>>(HttpMethod.Post, $"api/Report/GetHeaderCardList", request);
        }

        public async Task<BaseApiResponse<reportSingleHeaderCardResponse>> SingleHeaderCardReportAsync(reportSingleHeaderCardRequest request)
        {
            return await SendAsync<BaseApiResponse<reportSingleHeaderCardResponse>>(HttpMethod.Post, $"api/Report/GetDataReport_SingleHeaderCard", request);
        }

        public async Task<BaseApiResponse<reportMultiHeaderCardResponse>> MultiHeaderCardReportAsync(reportMultiHeaderCardRequest request)
        {
            return await SendAsync<BaseApiResponse<reportMultiHeaderCardResponse>>(HttpMethod.Post, $"api/Report/GetDataReport_MultiHeaderCard", request);
        }

        public async Task<BaseApiResponse<reportContainerResponse>> ContainerReportAsync(reportContainerRequest request)
        {
            return await SendAsync<BaseApiResponse<reportContainerResponse>>(HttpMethod.Post, $"api/Report/GetDataReport_Container", request);
        }

        public async Task<BaseApiResponse<reportAbnormalResponse>> AbnormalReportAsync(reportAbnormalRequest request)
        {
            return await SendAsync<BaseApiResponse<reportAbnormalResponse>>(HttpMethod.Post, $"api/Report/GetDataReport_Abnormal", request);
        }


    }
}
