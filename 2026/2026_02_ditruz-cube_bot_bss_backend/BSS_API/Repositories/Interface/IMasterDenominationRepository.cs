namespace BSS_API.Repositories.Interface
{
    using BSS_API.Models.Common;
    using BSS_API.Models.ObjectModels;
    using BSS_API.Models.RequestModels;
    using Models.Entities;
    using Models.SearchParameter;
    
    public interface IMasterDenominationRepository : IGenericRepository<MasterDenomination>
    {
        Task<ICollection<MasterDenomination>> GetMasterDenominationWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterDenomination>> SearchMasterDenomination(
           PagedRequest<MasterDenominationRequest> request,
           CancellationToken ct = default);
        Task<List<MasterDenoUnsortCcViewData>> GetDenominationUnsortCcRequestAsync(SystemSearchRequest request);
    }
}
