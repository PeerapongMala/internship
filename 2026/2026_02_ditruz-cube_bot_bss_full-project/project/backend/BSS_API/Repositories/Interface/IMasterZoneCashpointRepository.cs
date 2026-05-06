namespace BSS_API.Repositories.Interface
{
    using BSS_API.Models.Common;
    using BSS_API.Models.RequestModels;
    using Models.Entities;
    using Models.SearchParameter;
    
    public interface IMasterZoneCashpointRepository : IGenericRepository<MasterZoneCashpoint>
    {
        Task<List<MasterZoneCashpoint>> GetMasterZoneCashpointWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterZoneCashpoint>> SearchMasterZoneCashpoint(
           PagedRequest<MasterZoneCashpointRequest> request,
           CancellationToken ct = default);
    }
}
