using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterRoleService
    {
        Task<MasterRoleListResult> GetAllMasterRoleAsyn();
        Task<MasterRoleResult> GetRoleByIdAsync(int Id);
        Task<BaseServiceResult> UpdateRoleAsync(UpdateRoleRequest request);
        Task<BaseServiceResult> DeleteRoleAsync(int Id);
        Task<BaseServiceResult> CreateRoleAsync(CreateRoleRequest request);
        Task<MasterRoleListResult> GetRoleByFilterAsync(RoleFilterSearch request);
        Task<MasterRolePageResult> SearchRoleAsync(DataTablePagedRequest<MasterRoleRequest> request);
    }
}
