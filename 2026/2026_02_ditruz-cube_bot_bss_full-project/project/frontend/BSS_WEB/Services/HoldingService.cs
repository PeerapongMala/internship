using BSS_WEB.Interfaces;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Services
{
    public class HoldingService : BaseApiClient, IHoldingService
    {
        public HoldingService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<HoldingService> logger)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<HoldingSummaryResult>> GetHoldingSummaryAsync(HoldingFilterModel filter)
        {
            return await SendAsync<BaseApiResponse<HoldingSummaryResult>>(
                HttpMethod.Post, "api/Holding/GetHoldingSummary", filter);
        }

        public async Task<BaseApiResponse<object>> SubmitRejectAsync(HoldingFilterModel filter)
        {
            return await SendAsync<BaseApiResponse<object>>(
                HttpMethod.Post, "api/Holding/SubmitReject", filter);
        }
    }
}
