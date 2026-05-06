using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterRolePermissionService
    {
        Task<GetAllMasterRolePermissionResult> GetAllMasterRolePermissionAsyn();
        Task<GetRolePermissionByIdResult> GetRolePermissionByIdAsync(int Id);
        Task<BaseServiceResult> UpdateRolePermissionAsync(SaveRolePermissionRequest request);
        Task<BaseServiceResult> DeleteRolePermissionAsync(int Id);
        Task<BaseServiceResult> CreateRolePermissionAsync(CreateRolePermissionRequest request);
        Task<GetAllMasterRolePermissionResult> GetRolePermissionByFilterAsync(RolePermissionFilterSearch request);

    }
}
