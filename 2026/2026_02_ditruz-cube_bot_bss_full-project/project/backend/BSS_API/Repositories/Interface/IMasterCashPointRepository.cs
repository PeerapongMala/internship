namespace BSS_API.Repositories.Interface
{
    using BSS_API.Models.Common;
    using BSS_API.Models.ObjectModels;
    using BSS_API.Models.RequestModels;
    using Models.Entities;
    using Models.SearchParameter;
    
    public interface IMasterCashPointRepository : IGenericRepository<MasterCashPoint>
    {
        Task<List<MasterCashPoint>> GetMasterCashPointWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterCashPoint>> SearchMasterCashPoint(
           PagedRequest<MasterCashPointRequest> request,
           CancellationToken ct = default);
        Task<List<MasterCashPointUnsortCcViewData>> GetMasterCashPointUnsortCcRequestAsync(SystemSearchRequest request);
    }
}
