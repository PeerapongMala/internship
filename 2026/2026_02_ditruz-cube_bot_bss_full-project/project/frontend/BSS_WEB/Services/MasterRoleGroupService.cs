using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterRoleGroupService : BaseApiClient, IMasterRoleGroupService
    {
        public MasterRoleGroupService(IHttpContextAccessor contextAccessor,  ILogger<MasterRoleGroupService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {

        }
        public async Task<MasterRoleGroupListResult> GetAllMasterRoleGroupAsyn()
        {
            return await SendAsync<MasterRoleGroupListResult>(HttpMethod.Get, $"api/MasterRoleGroup/GetAll");

        }
        public async Task<MasterRoleGroupResult> GetRoleGroupByIdAsync(int Id)
        {
            return await SendAsync<MasterRoleGroupResult>(HttpMethod.Get, $"api/MasterRoleGroup/GetById?Id={Id}");

        }
        public async Task<BaseServiceResult> UpdateRoleGroupAsync(UpdateRoleGroupRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterRoleGroup/Update", request);

        }
        public async Task<BaseServiceResult> DeleteRoleGroupAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterRoleGroup/Remove?Id={Id}");

        }
        public async Task<BaseServiceResult> CreateRoleGroupAsync(CreateRoleGroupRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterRoleGroup/Create", request);

        }

        public async Task<BaseServiceResult> SearchRole([FromBody] DataTablePagedRequest<MasterRoleGroupRequest> request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterRoleGroup/SearchMasterRoleGroup", request);
        }

        public async Task<MasterRoleGroupPageResult> SearchRoleGroupAsync([FromBody] DataTablePagedRequest<MasterRoleGroupRequest> request)
        {
            return await SendAsync<MasterRoleGroupPageResult>(HttpMethod.Post, $"api/MasterRoleGroup/SearchRoleGroup", request);
        }
    }
}
