using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterUserRoleService
    {
        Task<IEnumerable<MasterUserRole>> GetAllUserRole();
        Task<MasterUserRole> GetUserRolesById(int Id);
        Task<MasterUserRole> GetUserRolesByUserId(int userId);
        Task<IEnumerable<MasterUserRole>> GetUserRoleByUniqueOrKey(int userId, int roleGroupId);
        Task CreateUserRole(CreateUserRoleRequest request);
        Task UpdateUserRole(UpdateUserRoleRequest request);
        Task DeleteUserRole(int Id);
    }
}
