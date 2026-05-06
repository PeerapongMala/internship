using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.HoldingDetail;

namespace BSS_WEB.Interfaces
{
    public interface IHoldingDetailService
    {
        Task<BaseApiResponse<HoldingDetailResult>> GetHoldingDetailAsync(string bnType, int departmentId);
        Task<BaseApiResponse<List<HoldingDetailByHcRowResult>>> GetHoldingDetailByHcAsync(string headerCards, string bnType);
    }
}
