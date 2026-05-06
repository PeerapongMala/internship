using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterMenuService : BaseApiClient, IMasterMenuService
    {
        public MasterMenuService(IHttpContextAccessor contextAccessor, ILogger<MasterMenuService> logger ,HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterMenuListResult> GetAllMasterMenuAsyn()
        {
            return await SendAsync<MasterMenuListResult>(HttpMethod.Get, $"api/MasterMenu/GetAll");

        }
        public async Task<MasterMenuActiveListResult> GetMasterMenuActiveAsyn()
        {
            return await SendAsync<MasterMenuActiveListResult>(HttpMethod.Get, $"api/MasterMenu/GetMenuActive");

        }
        public async Task<MasterMenuResult> GetMenuByIdAsync(int Id)
        {
            return await SendAsync<MasterMenuResult>(HttpMethod.Get, $"api/MasterMenu/GetById?Id={Id}");

        }
        public async Task<BaseServiceResult> UpdateMenuAsync(UpdateMenuRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterMenu/Update", request);

        }
        public async Task<BaseServiceResult> DeleteMenuAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterMenu/Remove?Id={Id}");

        }
        public async Task<BaseServiceResult> CreateMenuAsync(CreateMenuRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterMenu/Create", request);

        }

        public async Task<MasterMenuPageResult> SearchMenuAsync(DataTablePagedRequest<MasterMenuRequest> request)
        {
            return await SendAsync<MasterMenuPageResult>(HttpMethod.Post, $"api/MasterMenu/SearchMenu", request);
        }

        
    }
}
