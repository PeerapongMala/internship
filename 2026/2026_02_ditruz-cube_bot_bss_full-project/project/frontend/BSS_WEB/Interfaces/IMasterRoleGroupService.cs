using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Interfaces
{
    public interface IMasterRoleGroupService
    {
        Task<MasterRoleGroupListResult> GetAllMasterRoleGroupAsyn();
        Task<MasterRoleGroupResult> GetRoleGroupByIdAsync(int Id);
        Task<BaseServiceResult> UpdateRoleGroupAsync(UpdateRoleGroupRequest request);
        Task<BaseServiceResult> DeleteRoleGroupAsync(int Id);
        Task<BaseServiceResult> CreateRoleGroupAsync(CreateRoleGroupRequest request);
        Task<MasterRoleGroupPageResult> SearchRoleGroupAsync([FromBody] DataTablePagedRequest<MasterRoleGroupRequest> request);
    }
}
