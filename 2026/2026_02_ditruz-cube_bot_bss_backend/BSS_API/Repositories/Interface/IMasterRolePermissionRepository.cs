using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterRolePermissionRepository : IGenericRepository<MasterRolePermission>
    {
        Task<PagedData<MasterRolePermission>> SearchMasterRolePermission(
           PagedRequest<MasterRolePermissionRequest> request,
           CancellationToken ct = default);
    }
}
