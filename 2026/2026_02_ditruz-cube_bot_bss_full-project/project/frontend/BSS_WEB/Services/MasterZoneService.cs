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
    public class MasterZoneService : BaseApiClient, IMasterZoneService
    {
        public MasterZoneService(IHttpContextAccessor contextAccessor, ILogger<MasterZoneService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<GetAllMasterZoneResult> GetAllMasterZonesAsync()
        {
            return await SendAsync<GetAllMasterZoneResult>(HttpMethod.Get, $"api/MasterZone/GetAll");
        }

        public async Task<GetZoneByIdResult> GetZoneByIdAsync(int Id)
        {

            return await SendAsync<GetZoneByIdResult>(HttpMethod.Get, $"api/MasterZone/GetById?Id={Id}");
        }

        public async Task<BaseServiceResult> CreateZoneAsync(CreateZoneRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterZone/Create", request);
        }

        public async Task<BaseServiceResult> UpdateZoneAsync(UpdateZoneRequest request)
        {

            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterZone/Update", request);
        }

        public async Task<BaseServiceResult> DeleteZoneAsync(int Id)
        {

            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterZone/Remove?Id={Id}");
        }

        public async Task<GetAllMasterZoneResult> GetZoneByFilterAsync(ZoneFilterSearch request)
        {
            return await SendAsync<GetAllMasterZoneResult>(HttpMethod.Post, $"api/MasterZone/GetByFilter", request);
        }

        public async Task<MasterZoneResult> SearchZoneAsync(PagedRequest<MasterZoneRequest> request)
        {
            return await SendAsync<MasterZoneResult>(HttpMethod.Post, $"api/MasterZone/SearchZone", request);
        }
    }
}
