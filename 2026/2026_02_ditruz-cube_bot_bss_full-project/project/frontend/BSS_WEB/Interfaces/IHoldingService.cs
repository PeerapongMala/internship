using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IHoldingService
    {
        Task<BaseApiResponse<HoldingSummaryResult>> GetHoldingSummaryAsync(HoldingFilterModel filter);
        Task<BaseApiResponse<object>> SubmitRejectAsync(HoldingFilterModel filter);
    }
}
