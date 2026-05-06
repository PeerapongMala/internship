using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterUserService
    {
        Task<IEnumerable<MasterUser>> GetAllUsers();
        Task<IEnumerable<MasterUser>> GetUserByUserName(string userName);
        Task<IEnumerable<MasterUser>> GetUserByEmail(string userEmail);
        Task CreateUser(CreateUserRequest request);
        Task UpdateUser(UpdateUserRequest request);
        Task<MasterUserViewData> GetUserById(int Id);
        Task DeleteUser(DeleteUserRequest request);
        Task<IEnumerable<MasterUserViewData>> GetUserByFilter(GetUserByFilterRequest filter);
        Task<IEnumerable<UserInfoData>> GetOperatorUsersActive(GetSorterUsersRequest request);
        Task<PagedData<MasterUserViewData>> SearchUser(PagedRequest<MasterUserRequest> request);
        Task<IEnumerable<UserLoginDropdownData>?> GetUserLoginDropdownAsync();
    }
}
