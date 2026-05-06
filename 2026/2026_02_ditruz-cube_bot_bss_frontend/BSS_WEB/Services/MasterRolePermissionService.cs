using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterRolePermissionService : BaseApiClient, IMasterRolePermissionService
    {
        public MasterRolePermissionService(IHttpContextAccessor contextAccessor, ILogger<MasterRolePermissionService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }
        public async Task<GetAllMasterRolePermissionResult> GetAllMasterRolePermissionAsyn()
        {
            return await SendAsync<GetAllMasterRolePermissionResult>(HttpMethod.Get, $"api/MasterRolePermission/GetAll");

        }
        public async Task<GetRolePermissionByIdResult> GetRolePermissionByIdAsync(int Id)
        {
            return await SendAsync<GetRolePermissionByIdResult>(HttpMethod.Get, $"api/MasterRolePermission/GetById?Id={Id}");

        }
        public async Task<GetAllMasterRolePermissionResult> GetMasterRolePermissionListsAsyn()
        {
            return await SendAsync<GetAllMasterRolePermissionResult>(HttpMethod.Get, $"api/MasterRolePermission/GetRolePermissionLists");

        }
        public async Task<BaseServiceResult> UpdateRolePermissionAsync(SaveRolePermissionRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterRolePermission/Update", request);

        }
        public async Task<BaseServiceResult> DeleteRolePermissionAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterRolePermission/Remove?Id={Id}");

        }
        public async Task<BaseServiceResult> CreateRolePermissionAsync(CreateRolePermissionRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterRolePermission/Create", request);

        }
        public async Task<GetAllMasterRolePermissionResult> GetRolePermissionByFilterAsync(RolePermissionFilterSearch request)
        {
            return await SendAsync<GetAllMasterRolePermissionResult>(HttpMethod.Post, $"api/MasterRolePermission/GetByFilter", request);

        }
    }
}
