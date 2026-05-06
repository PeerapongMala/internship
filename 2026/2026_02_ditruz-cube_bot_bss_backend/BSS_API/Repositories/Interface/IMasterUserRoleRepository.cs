using BSS_API.Models.Entities;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterUserRoleRepository : IGenericRepository<MasterUserRole>
    {
        IQueryable<MasterUserRole> GetQueryable();

        Task<List<MasterUserRole>> GetMasterUserRoleWithSearchRequestAsync(SystemSearchRequest request);
    }
}