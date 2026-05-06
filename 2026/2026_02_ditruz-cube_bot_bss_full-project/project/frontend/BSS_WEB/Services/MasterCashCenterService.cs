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
    public class MasterCashCenterService: BaseApiClient, IMasterCashCenterService
    {
        public MasterCashCenterService(IHttpContextAccessor contextAccessor, ILogger<MasterCashCenterService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterCashCenterListResult> GetCashCenterAllAsync()
        {
            return await SendAsync<MasterCashCenterListResult>(HttpMethod.Get, $"api/MasterCashCenter/GetAll");
        }
        public async Task<MasterCashCenterResult> GetCashCenterByIdAsync(int Id)
        {
            return await SendAsync<MasterCashCenterResult>(HttpMethod.Get, $"api/MasterCashCenter/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateCashCenterAsync(MasterCashCenterDisplay request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterCashCenter/Update", request);
        }
        public async Task<BaseServiceResult> CreateCashCenterAsync(MasterCashCenterDisplay request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterCashCenter/Create", request);
        }
        public async Task<BaseServiceResult> DeleteCashCenterAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterCashCenter/Remove?Id={Id}");
        }
        public async Task<MasterCashCenterListResult> GetCashCenterByFilterAsync(CashCenterFilterSearch request)
        {
            return await SendAsync<MasterCashCenterListResult>(HttpMethod.Post, $"api/MasterCashCenter/GetByFilter", request);
        }

        public async Task<MasterCashCenterPageResult> SearchMasterCashCenterAsync(PagedRequest<MasterCashCenterRequest> request)
        {
            return await SendAsync<MasterCashCenterPageResult>(HttpMethod.Post, $"api/MasterCashCenter/SearchCashCenter", request);
        }
    }
}
