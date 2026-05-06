using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterZoneRepository : IGenericRepository<MasterZone>
    {
        IQueryable<MasterZone> GetQueryable();

        Task<ICollection<MasterZone>> GetMasterZoneWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterZone>> SearchMasterZone(
           PagedRequest<MasterZoneRequest> request,
           CancellationToken ct = default);
        Task<List<MasterZoneUnsortCcViewData>> GetMasterZoneUnsortCcRequestAsync(SystemSearchRequest request);
    }
}