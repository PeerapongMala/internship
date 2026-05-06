using BSS_WEB.Interfaces;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.HoldingDetail;

namespace BSS_WEB.Services
{
    public class HoldingDetailService : BaseApiClient, IHoldingDetailService
    {
        public HoldingDetailService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<HoldingDetailService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<HoldingDetailResult>> GetHoldingDetailAsync(string bnType, int departmentId)
        {
            return await SendAsync<BaseApiResponse<HoldingDetailResult>>(
                HttpMethod.Get,
                $"api/HoldingDetail/GetHoldingDetail?bnType={Uri.EscapeDataString(bnType)}&departmentId={departmentId}");
        }

        public async Task<BaseApiResponse<List<HoldingDetailByHcRowResult>>> GetHoldingDetailByHcAsync(string headerCards, string bnType)
        {
            return await SendAsync<BaseApiResponse<List<HoldingDetailByHcRowResult>>>(
                HttpMethod.Get,
                $"api/HoldingDetail/GetHoldingDetailByHc?headerCards={Uri.EscapeDataString(headerCards)}&bnType={Uri.EscapeDataString(bnType)}");
        }
    }
}
