using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterZoneCashpoinService
    {
        Task<MasterZoneCashpointListResult> GetAllZoneAsync();
        Task<MasterZoneCashpointResult> GetZoneCashpointByIdAsync(int Id);
        Task<BaseServiceResult> CreateZoneCashPoint(CreateZoneCashpointRequest request);
        Task<BaseServiceResult> UpdateZoneCashPoint(UpdateZoneCashpointRequest request);
        Task<BaseServiceResult> DeleteZoneCashpoint(int Id);
        Task<MasterZoneCashpointListResult> GetZoneCashpointByFilterAsync(ZoneCashpointFilterSearch request);
        Task<MasterZoneCashpointPageResult> SearchZoneCashpointAsync(PagedRequest<MasterZoneCashpointRequest> request);
    }
}
