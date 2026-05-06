using BSS_API.Models.ResponseModels;

namespace BSS_API.Services.Interface
{
    public interface IHoldingDetailService
    {
        Task<HoldingDetailResponse> GetHoldingDetailAsync(string bnType, int departmentId);
        Task<List<HoldingDetailByHcRow>> GetHoldingDetailByHcAsync(string headerCards, string bnType);
    }
}
