using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterRoleService
    {
        Task<IEnumerable<MasterRole>> GetAllRoles();
        Task CreateRole(CreateRoleRequest request);
        Task UpdateRole(UpdateRoleRequest request);
        Task<MasterRoleViewData> GetRoleById(int Id);
        Task DeleteRole(int id);
        Task<IEnumerable<MasterRoleViewData>> GetRoleByFilter(RoleFilterRequest filter);
        Task<IEnumerable<MasterRole>> GetRoleByUniqueOrKey(string roleCode, int roleGroupId);
        Task<MasterRole> GetRoleByCode(string roleCode);
        Task<IEnumerable<MasterRole>> GetRoleByRoleGroup(int roleGroupId);
        Task<PagedData<MasterRoleViewData>> SearchRole(PagedRequest<MasterRoleRequest> request);
    }
}
