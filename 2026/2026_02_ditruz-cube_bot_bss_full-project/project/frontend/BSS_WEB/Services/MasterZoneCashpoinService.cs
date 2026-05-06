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
    public class MasterZoneCashpoinService : BaseApiClient, IMasterZoneCashpoinService
    {
        public MasterZoneCashpoinService(IHttpContextAccessor contextAccessor, ILogger<MasterZoneCashpoinService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterZoneCashpointListResult> GetAllZoneAsync()
        {
            return await SendAsync<MasterZoneCashpointListResult>(HttpMethod.Get, $"api/MasterZoneCashpoint/GetAll");
        }

        public async Task<MasterZoneCashpointResult> GetZoneCashpointByIdAsync(int Id)
        {
            return await SendAsync<MasterZoneCashpointResult>(HttpMethod.Get, $"api/MasterZoneCashpoint/GetById?Id={Id}");
        }

        public async Task<BaseServiceResult> CreateZoneCashPoint(CreateZoneCashpointRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterZoneCashpoint/Create", request);
        }

        public async Task<BaseServiceResult> UpdateZoneCashPoint(UpdateZoneCashpointRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterZoneCashpoint/Update", request);
        }

        public async Task<BaseServiceResult> DeleteZoneCashpoint(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterZoneCashpoint/Remove?Id={Id}");
        }

        public async Task<MasterZoneCashpointListResult> GetZoneCashpointByFilterAsync(ZoneCashpointFilterSearch request)
        {
            return await SendAsync<MasterZoneCashpointListResult>(HttpMethod.Post, $"api/MasterZoneCashpoint/GetByFilter", request);
        }

        public async Task<MasterZoneCashpointPageResult> SearchZoneCashpointAsync(PagedRequest<MasterZoneCashpointRequest> request)
        {
            return await SendAsync<MasterZoneCashpointPageResult>(HttpMethod.Post, $"api/MasterZoneCashpoint/SearchZoneCashpoint", request);
        }
    }
}
