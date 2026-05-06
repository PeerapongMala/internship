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
    public class MasterConfigTypeService : BaseApiClient, IMasterConfigTypeService
    {

        public MasterConfigTypeService(IHttpContextAccessor contextAccessor, ILogger<MasterConfigTypeService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterConfigTypeListResult> GetAllMasterConfigTypeAsyn()
        {
            return await SendAsync<MasterConfigTypeListResult>(HttpMethod.Get, $"api/MasterConfigType/GetAll");
        }
        public async Task<MasterConfigTypeResult> GetConfigTypeByIdAsync(int Id)
        {
            return await SendAsync<MasterConfigTypeResult>(HttpMethod.Get, $"api/MasterConfigType/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateConfigTypeAsync(UpdateConfigTypeRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterConfigType/Update", request);
        }
        public async Task<BaseServiceResult> DeleteConfigTypeAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterConfigType/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateConfigTypeAsync(CreateConfigTypeRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterConfigType/Create", request);
        }

        public async Task<MasterConfigTypePageResult> SearchConfigTypeAsync(PagedRequest<MasterConfigTypeRequest> request)
        {
            return await SendAsync<MasterConfigTypePageResult>(HttpMethod.Post, $"api/MasterConfigType/SearchConfigType", request);
        }
    }
    
}
