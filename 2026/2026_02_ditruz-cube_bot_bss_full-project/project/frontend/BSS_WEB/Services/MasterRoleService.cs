using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterRoleService : BaseApiClient, IMasterRoleService
    {
        public MasterRoleService(IHttpContextAccessor contextAccessor, ILogger<MasterRoleService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterRoleListResult> GetAllMasterRoleAsyn()
        {
            return await SendAsync<MasterRoleListResult>(HttpMethod.Get, $"api/MasterRole/GetAll");

        }
        public async Task<MasterRoleResult> GetRoleByIdAsync(int Id)
        {
            return await SendAsync<MasterRoleResult>(HttpMethod.Get, $"api/MasterRole/GetById?Id={Id}");

        }
        public async Task<BaseServiceResult> UpdateRoleAsync(UpdateRoleRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterRole/Update", request);

        }
        public async Task<BaseServiceResult> DeleteRoleAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterRole/Remove?Id={Id}");

        }
        public async Task<BaseServiceResult> CreateRoleAsync(CreateRoleRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterRole/Create", request);

        }
        public async Task<MasterRoleListResult> GetRoleByFilterAsync(RoleFilterSearch request)
        {
            return await SendAsync<MasterRoleListResult>(HttpMethod.Post, $"api/MasterRole/GetByFilter", request);

        }

        public async Task<MasterRolePageResult> SearchRoleAsync(DataTablePagedRequest<MasterRoleRequest> request)
        {
            return await SendAsync<MasterRolePageResult>(HttpMethod.Post, $"api/MasterRole/SearchRole", request);
        }
    }
}
