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
    public class MasterM7DenominationService : BaseApiClient, IMasterM7DenominationService
    {
        public MasterM7DenominationService(IHttpContextAccessor contextAccessor, ILogger<MasterM7DenominationService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterM7DenominationListResult> GetM7DenominationsAllAsync()
        {
            return await SendAsync<MasterM7DenominationListResult>(HttpMethod.Get, $"api/MasterMSevenDenom/GetAll");
        }
        public async Task<MasterM7DenominationResult> GetM7DenominationsByIdAsync(int Id)
        {
            return await SendAsync<MasterM7DenominationResult>(HttpMethod.Get, $"api/MasterMSevenDenom/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateM7DenominationAsync(UpdateM7DenominationRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterMSevenDenom/Update", request);
        }
        public async Task<BaseServiceResult> DeleteM7DenominationAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterMSevenDenom/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateM7DenominationAsync(CreateM7DenominationRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterMSevenDenom/Create", request);
        }
        public async Task<MasterM7DenominationListResult> GetM7DenominationByFilterAsync(M7DenominationFilterSearch request)
        {
            return await SendAsync<MasterM7DenominationListResult>(HttpMethod.Post, $"api/MasterMSevenDenom/GetByFilter", request);
        }

        public async Task<MasterM7DenominationPageResult> SearchM7DenominationAsync(PagedRequest<MasterM7DenominationRequest> request)
        {
            return await SendAsync<MasterM7DenominationPageResult>(HttpMethod.Post, $"api/MasterMSevenDenom/SearchMSevenDenom", request);
        }
    }
}
