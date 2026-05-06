using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterRolePermissionService
    {
        Task<IEnumerable<MasterRolePermission>> GetAllRolePermissions();
        Task<MasterRolePermission> GetRolePermissionById(int Id);
        Task DeleteRolePermission(int Id);
        Task DeleteRolePermissionByRoleId(int roleId);
        Task<IEnumerable<MasterRolePermissionData>> GetRolePermissionByFilter(RolePermissionFilterRequest filter);
        Task<IEnumerable<MasterRolePermissionData>> GetRolePermissionLists();
        Task<IEnumerable<MasterRolePermissionDetailData>> GetRolePermissionByRoleId(int roleId);
        Task CreateOrUpdateRolePermission(SaveRolePermissionRequest request);
        Task<IEnumerable<MasterRolePermission>> GetRolePermissionByUniqueOrKey(int roleId);
    }
}
