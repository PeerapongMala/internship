using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterRoleGroupRepository : IGenericRepository<MasterRoleGroup>
    {
        public Task<MasterRoleGroup?> GetRoleGroupByIdAsync(int roleGroupId);
        IQueryable<MasterRoleGroup> GetQueryable();

        public Task<PagedData<MasterRoleGroup>> SearchRoleGroup(
            PagedRequest<MasterRoleGroupRequest> request,
            CancellationToken ct = default);

    }
}
