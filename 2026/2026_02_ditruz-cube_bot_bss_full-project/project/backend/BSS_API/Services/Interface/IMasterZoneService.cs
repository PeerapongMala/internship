using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterZoneService
    {
        Task<IEnumerable<MasterZone>> GetAllZone();
        Task<MasterZoneViewData> GetMasterZoneById(int Id);
        Task<IEnumerable<MasterZoneViewData>> GetZoneByFilter(ZoneFilterRequest filter);
        Task<IEnumerable<MasterZone>> GetZoneByUniqueOrKey(string zoneCode, int departmentId, int? instId);
        Task CreateZone(CreateMasterZoneRequest request);
        Task UpdateZone(UpdateMasterZoneRequest request);
        Task DeleteZone(int Id);
        Task<PagedData<MasterZoneViewData>> SearchZone(PagedRequest<MasterZoneRequest> request);
    }
}
