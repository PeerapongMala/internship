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
    public class MasterCashPointService : BaseApiClient, IMasterCashPointService
    {
        public MasterCashPointService(IHttpContextAccessor contextAccessor, ILogger<MasterCashPointService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterCashPointListResult> GetCashPointAllAsync()
        {
            return await SendAsync<MasterCashPointListResult>(HttpMethod.Get, $"api/MasterCashPoint/GetAll");
        }
        public async Task<MasterCashPointResult> GetCashPointByIdAsync(int Id)
        {
            return await SendAsync<MasterCashPointResult>(HttpMethod.Get, $"api/MasterCashPoint/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateCashPointAsync(UpdateCashPointRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterCashPoint/Update", request);
        }
        public async Task<BaseServiceResult> CreateCashPointAsync(CreateCashPointRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterCashPoint/Create", request);
        }
        public async Task<BaseServiceResult> DeleteCashPointAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterCashPoint/Remove?Id={Id}");
        }
        public async Task<MasterCashPointListResult> GetCashPointByFilterAsync(CashPointFilterSearch request)
        {
            return await SendAsync<MasterCashPointListResult>(HttpMethod.Post, $"api/MasterCashPoint/GetByFilter", request);
        }

        public async Task<MasterCashPointPageResult> SearchCashPointAsync(PagedRequest<MasterCashPointRequest> request)
        {
            return await SendAsync<MasterCashPointPageResult>(HttpMethod.Post, $"api/MasterCashPoint/SearchCashPoint", request);
        }
    }
}
