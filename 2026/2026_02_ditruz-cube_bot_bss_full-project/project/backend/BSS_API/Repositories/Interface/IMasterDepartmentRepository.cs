using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterDepartmentRepository : IGenericRepository<MasterDepartment>
    {
        public Task<PagedData<MasterDepartment>> SearchDepartment(
            PagedRequest<MasterDepartmentRequest> request,
            CancellationToken ct = default);
    }
}
