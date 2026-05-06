using BSS_API.Models.RequestModels;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;


namespace BSS_WEB.Services
{
    public class MasterM7QualityService : BaseApiClient, IMasterM7QualityService
    {
        public MasterM7QualityService(IHttpContextAccessor contextAccessor, ILogger<MasterM7QualityService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterM7QualityListResult> GetAllMasterM7QualityAsyn()
        {
            return await SendAsync<MasterM7QualityListResult>(HttpMethod.Get, $"api/MasterMSevenQuality/GetAll");
        }
        public async Task<MasterM7QualityResult> GetM7QualityByIdAsync(int Id)
        {
            return await SendAsync<MasterM7QualityResult>(HttpMethod.Get, $"api/MasterMSevenQuality/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateM7QualityAsync(UpdateM7QualityRequest  request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterMSevenQuality/Update", request);
        }
        public async Task<BaseServiceResult> DeleteM7QualityAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterMSevenQuality/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateM7QualityAsync(CreateM7QualityRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterMSevenQuality/Create", request);
        }
        public async Task<MasterM7QualityPageResult> SearchIM7QualityAsync(PagedRequest<MasterM7QualityRequest> request)
        {
            return await SendAsync<MasterM7QualityPageResult>(HttpMethod.Post, $"api/MasterMSevenQuality/SearchMSevenQuality", request);
        }

        public async Task<MasterM7QualityPageResult> SearchM7QualityAsync(PagedRequest<MasterM7QualityRequest> request)
        {
            return await SendAsync<MasterM7QualityPageResult>(HttpMethod.Post, $"api/MasterMSevenQuality/SearchMSevenQuality", request);
        }
    }
}
