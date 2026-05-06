using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterMachineTypeRepository : IGenericRepository<MasterMachineType>
    {
        Task<PagedData<MasterMachineType>> SearchMasterMachineType(
           PagedRequest<MasterMachineTypeRequest> request,
           CancellationToken ct = default);
    }
}
