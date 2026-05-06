using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.ManualKeyIn;

namespace BSS_WEB.Services
{
    public class ManualKeyInService : BaseApiClient, IManualKeyInService
    {
        public ManualKeyInService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<ManualKeyInService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<ManualKeyInHeaderCardInfoResult>> GetHeaderCardInfoAsync(string headerCardCode)
        {
            return await SendAsync<BaseApiResponse<ManualKeyInHeaderCardInfoResult>>(
                HttpMethod.Get, $"api/ManualKeyIn/GetHeaderCardInfo?headerCardCode={Uri.EscapeDataString(headerCardCode)}");
        }

        public async Task<BaseApiResponse<ManualKeyInDenominationResult>> GetDenominationsAsync(long prepareId)
        {
            return await SendAsync<BaseApiResponse<ManualKeyInDenominationResult>>(
                HttpMethod.Get, $"api/ManualKeyIn/GetDenominations?prepareId={prepareId}");
        }

        public async Task<BaseApiResponse<ManualKeyInSaveResult>> SaveAsync(ManualKeyInSaveRequest request)
        {
            return await SendAsync<BaseApiResponse<ManualKeyInSaveResult>>(
                HttpMethod.Post, "api/ManualKeyIn/Save", request);
        }

        public async Task<BaseApiResponse<ManualKeyInSaveResult>> SubmitForApprovalAsync(ManualKeyInSubmitRequest request)
        {
            return await SendAsync<BaseApiResponse<ManualKeyInSaveResult>>(
                HttpMethod.Post, "api/ManualKeyIn/SubmitForApproval", request);
        }
    }
}
