using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterRoleRepository : IGenericRepository<MasterRole>
    {
        IQueryable<MasterRole> GetQueryable();

        Task<ICollection<MasterRole>> GetMasterRoleWithSearchRequestAsync(SystemSearchRequest request);
        public Task<PagedData<MasterRole>> SearchRole(
           PagedRequest<MasterRoleRequest> request,
           CancellationToken ct = default);
    }
}