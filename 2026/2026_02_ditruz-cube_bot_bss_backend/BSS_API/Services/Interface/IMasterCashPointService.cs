using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterCashPointService
    {
        Task<IEnumerable<MasterCashPoint>> GetAllCashPoint();
        Task CreateCashPoint(CreateCashPointRequest request);
        Task UpdateCashPoint(UpdateCashPointRequest request);
        Task<MasterCashPointViewData> GetCashPointById(int Id);
        Task DeleteCashPoint(int Id);
        Task<IEnumerable<MasterCashPointViewData>> GetCashPointByFilter(CashPointFilterRequest request);
        Task<IEnumerable<MasterCashPoint>> GetCashPointByUniqueOrKey(string branchCode, int institutionId, string cbBcdCode);
        Task<PagedData<MasterCashPointViewData>> SearchCashPoint(PagedRequest<MasterCashPointRequest> request);
    }
}
