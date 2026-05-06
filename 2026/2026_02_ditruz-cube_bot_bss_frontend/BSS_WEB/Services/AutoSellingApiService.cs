using BSS_WEB.Interfaces;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.AutoSelling;

namespace BSS_WEB.Services
{
    public class AutoSellingApiService : BaseApiClient, IAutoSellingApiService
    {
        public AutoSellingApiService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<AutoSellingApiService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<AutoSellingAllDataResult>> GetAllDataAsync(AutoSellingFilterRequest filter)
        {
            return await SendAsync<BaseApiResponse<AutoSellingAllDataResult>>(
                HttpMethod.Post, "api/AutoSelling/GetAllData", filter);
        }

        public async Task<BaseApiResponse<AutoSellingDetailResult>> GetDetailAsync(string headerCardCode)
        {
            return await SendAsync<BaseApiResponse<AutoSellingDetailResult>>(
                HttpMethod.Get, $"api/AutoSelling/GetDetail?headerCardCode={headerCardCode}");
        }

        public async Task<BaseApiResponse<AutoSellingActionResult>> SaveAdjustmentAsync(AutoSellingAdjustmentRequest request)
        {
            return await SendAsync<BaseApiResponse<AutoSellingActionResult>>(
                HttpMethod.Post, "api/AutoSelling/SaveAdjustment", request);
        }

        public async Task<BaseApiResponse<AutoSellingActionResult>> MergeBundlesAsync(AutoSellingMergeRequest request)
        {
            return await SendAsync<BaseApiResponse<AutoSellingActionResult>>(
                HttpMethod.Post, "api/AutoSelling/MergeBundles", request);
        }

        public async Task<BaseApiResponse<AutoSellingValidateSummaryResult>> ValidateSummaryAsync(AutoSellingValidateSummaryRequest request)
        {
            return await SendAsync<BaseApiResponse<AutoSellingValidateSummaryResult>>(
                HttpMethod.Post, "api/AutoSelling/ValidateSummary", request);
        }

        public async Task<BaseApiResponse<AutoSellingActionResult>> CancelSendAsync(AutoSellingCancelSendRequest request)
        {
            return await SendAsync<BaseApiResponse<AutoSellingActionResult>>(
                HttpMethod.Post, "api/AutoSelling/CancelSend", request);
        }

        public async Task<BaseApiResponse<AutoSellingActionResult>> ChangeShiftAsync(AutoSellingChangeShiftRequest request)
        {
            return await SendAsync<BaseApiResponse<AutoSellingActionResult>>(
                HttpMethod.Post, "api/AutoSelling/ChangeShift", request);
        }

        public async Task<BaseApiResponse<AutoSellingActionResult>> SaveInsertReplaceAsync(AutoSellingInsertReplaceRequest request)
        {
            return await SendAsync<BaseApiResponse<AutoSellingActionResult>>(
                HttpMethod.Post, "api/AutoSelling/SaveInsertReplace", request);
        }

        public async Task<BaseApiResponse<AutoSellingActionResult>> SaveAdjustOffsetAsync(AdjustOffsetRequest request)
        {
            return await SendAsync<BaseApiResponse<AutoSellingActionResult>>(
                HttpMethod.Post, "api/AutoSelling/SaveAdjustOffset", request);
        }
    }
}
