using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterUserService
    {
        Task<GetAllMasterUserResult> GetAllMasterUserAsyn();
        Task<GetUserByIdResult> GetUserByIdAsync(int Id);
        Task<BaseServiceResult> UpdateUserAsync(UpdateUserRequest request);
        Task<BaseServiceResult> DeleteUserAsync(DeleteUserRequest request);
        Task<BaseServiceResult> CreateUserAsync(CreateUserRequest request);
        Task<GetAllMasterUserResult> GetUserByFilterAsync(UseFilterSearch request);
        Task<MasterUserResult> SearchUserAsync(PagedRequest<MasterUserRequest> request);
    }
}
