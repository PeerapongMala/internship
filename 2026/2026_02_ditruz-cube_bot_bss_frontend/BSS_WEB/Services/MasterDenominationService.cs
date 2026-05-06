using BSS_API.Models.RequestModels;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterDenominationService : BaseApiClient, IMasterDenominationService
    {

        public MasterDenominationService(IHttpContextAccessor contextAccessor, ILogger<MasterDenominationService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {

        }

        public async Task<MasterDenominationListResult> GetAllMasterDenominationAsyn()
        {
            return await SendAsync<MasterDenominationListResult>(HttpMethod.Get, $"api/MasterDenomination/GetAll");
        }
        public async Task<MasterDenominationResult> GetDenominationByIdAsync(int Id)
        {
            return await SendAsync<MasterDenominationResult>(HttpMethod.Get, $"api/MasterDenomination/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateDenominationAsync(UpdateDenominationRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterDenomination/Update", request);
        }
        public async Task<BaseServiceResult> DeleteDenominationAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterDenomination/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateDenominationAsync(CreateDenominationRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterDenomination/Create", request);
        }

        public async Task<MasterDenominationPageResult> SearchDenominationAsync(PagedRequest<MasterDenominationRequest> request)
        {
            return await SendAsync<MasterDenominationPageResult>(HttpMethod.Post, $"api/MasterDenomination/SearchDenomination", request);
        }
    }
}
