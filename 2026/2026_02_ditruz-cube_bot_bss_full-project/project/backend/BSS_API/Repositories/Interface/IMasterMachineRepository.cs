namespace BSS_API.Repositories.Interface
{
    using BSS_API.Models.Common;
    using BSS_API.Models.ObjectModels;
    using BSS_API.Models.RequestModels;
    using Models.Entities;
    using Models.SearchParameter;
    
    public interface IMasterMachineRepository : IGenericRepository<MasterMachine>
    {
        Task<List<MasterMachine>> GetMasterMachineWithSearchRequestAsync(SystemSearchRequest request);
        Task<PagedData<MasterMachine>> SearchMasterMachine(
           PagedRequest<MasterMachineRequest> request,
           CancellationToken ct = default);
        Task<MasterMachine> GetById(int machineId);
    }
}
