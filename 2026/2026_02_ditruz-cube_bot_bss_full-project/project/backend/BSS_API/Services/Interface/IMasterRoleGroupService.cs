using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterRoleGroupService
    {
        Task<IEnumerable<MasterRoleGroup>> GetAllRoleGroups();
        Task CreateRoleGroup(CreateRoleGroupRequest request);
        Task UpdateRoleGroup(UpdateRoleGroupRequest request);
        Task<MasterRoleGroupViewData> GetRoleGroupById(int Id);
        Task DeleteRoleGroup(int id);
        Task<IEnumerable<MasterRoleGroup>> GetRoleGroupByUniqueOrKey(string roleGroupCode);
        Task<PagedData<MasterRoleGroup>> SearchRoleGroup(PagedRequest<MasterRoleGroupRequest> request);
    }
}
