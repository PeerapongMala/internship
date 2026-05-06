using BSS_API.Models.RequestModels;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterUserService : BaseApiClient , IMasterUserService
    {
        public MasterUserService(IHttpContextAccessor contextAccessor, ILogger<MasterUserService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<GetAllMasterUserResult> GetAllMasterUserAsyn()
        {
            return await SendAsync<GetAllMasterUserResult>(HttpMethod.Get, $"api/MasterUser/GetAll");
        }

        public async Task<GetUserByIdResult> GetUserByIdAsync(int Id)
        {
            return await SendAsync<GetUserByIdResult>(HttpMethod.Get, $"api/MasterUser/GetById?Id={Id}");
        }

        public async Task<BaseServiceResult> UpdateUserAsync(UpdateUserRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterUser/Update", request);
        }

        
        public async Task<BaseServiceResult> DeleteUserAsync(DeleteUserRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterUser/Delete" , request);
        } 

        public async Task<BaseServiceResult> CreateUserAsync(CreateUserRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterUser/Create", request);
        }

        public async Task<GetAllMasterUserResult> GetUserByFilterAsync(UseFilterSearch request)
        {
            return await SendAsync<GetAllMasterUserResult>(HttpMethod.Post, $"api/MasterUser/GetByFilter", request);
        }

        public async Task<MasterUserResult> SearchUserAsync(PagedRequest<MasterUserRequest> request)
        {
            return await SendAsync<MasterUserResult>(HttpMethod.Post, $"api/MasterUser/SearchUser", request);
        }
    }
}
