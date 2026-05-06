using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterCashCenterService
    {
        Task<IEnumerable<MasterCashCenter>> GetAllCashCenter();
        Task CreateCashCenter(CreateCashCenterRequest request);
        Task UpdateCashCenter(UpdateCashCenterRequest request);
        Task<MasterCashCenterViewData> GetCashCenterById(int Id);
        Task DeleteCashCenter(int Id);
        Task<IEnumerable<MasterCashCenterViewData>> GetCashCenterByFilter(CashCenterFilterRequest filter);
        Task<IEnumerable<MasterCashCenter>> GetCashCenterByUniqueOrKey(string cashCenterCode);
        Task<PagedData<MasterCashCenterViewData>> SearchCashCenter(PagedRequest<MasterCashCenterRequest> request);
    }
}
