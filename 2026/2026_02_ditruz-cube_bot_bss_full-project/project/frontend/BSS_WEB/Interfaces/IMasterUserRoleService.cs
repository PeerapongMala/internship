using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterUserRoleService
    {
        Task<GetAllMasterUserRoleResult> GetAllMasterUserRoleAsyn();
        Task<GetUserRoleByIdResult> GetUserRoleByIdAsync(int Id);
        Task<GetUserRoleByIdResult> GetUserRoleByUserIdAsync(int userId);
    }
}
