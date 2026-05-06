using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterZoneCashpointService
    {
        Task<IEnumerable<MasterZoneCashpoint>> GetAllZoneCashpoints();
        Task<MasterZoneCashpointViewData> GetZoneCashpoinById(int Id);
        Task<IEnumerable<MasterZoneCashpointViewData>> GetZoneCashpointByFilter(ZoneCashpointFilterRequest filter);
        Task<IEnumerable<MasterZoneCashpoint>> GetZoneCashpointByUniqueOrKey(int zoneId, int cashpointId);
        Task CreateZoneCashpoint(CreateZoneCashpoint request);
        Task UpdateZoneCashpoint(UpdateZoneCashpoint request);
        Task DeleteZoneCashpoint(int Id);
        Task<PagedData<MasterZoneCashpointViewData>> SearchZoneCashpoint(PagedRequest<MasterZoneCashpointRequest> request);
    }
}
