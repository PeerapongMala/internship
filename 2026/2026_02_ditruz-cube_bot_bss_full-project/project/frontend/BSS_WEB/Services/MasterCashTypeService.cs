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
    public class MasterCashTypeService : BaseApiClient, IMasterCashTypeService
    {
        public MasterCashTypeService(IHttpContextAccessor contextAccessor, ILogger<MasterCashTypeService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterCashTypeListResult> GetAllMasterCashTypeAsyn()
        {
            return await SendAsync<MasterCashTypeListResult>(HttpMethod.Get, $"api/MasterCashType/GetAll");
        }
        public async Task<MasterCashTypeResult> GetCashTypeByIdAsync(int Id)
        {
            return await SendAsync<MasterCashTypeResult>(HttpMethod.Get, $"api/MasterCashType/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateCashTypeAsync(MasterCashTypeDisplay request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterCashType/Update", request);
        }
        public async Task<BaseServiceResult> DeleteCashTypeAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterCashType/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateCashTypeAsync(MasterCashTypeDisplay request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterCashType/Create", request);
        }

        public async Task<MasterCashTypePageResult> SearchCashTypeAsync(PagedRequest<MasterCashTypeRequest> request)
        {
            return await SendAsync<MasterCashTypePageResult>(HttpMethod.Post, $"api/MasterCashType/SearchCashType", request);
        }
    }
}
