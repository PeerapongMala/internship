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
    public class MasterDenomReconcileService : BaseApiClient, IMasterDenomReconcileService
    {
        public MasterDenomReconcileService(IHttpContextAccessor contextAccessor, ILogger<MasterDenomReconcileService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterDenomReconcileListResult> GetAllMasterDenomReconcileAsyn()
        {
            return await SendAsync<MasterDenomReconcileListResult>(HttpMethod.Get, $"api/MasterDenomReconcile/GetAll");
        }
        public async Task<MasterDenomReconcileResult> GetDenomReconcileByIdAsync(int Id)
        {
            return await SendAsync<MasterDenomReconcileResult>(HttpMethod.Get, $"api/MasterDenomReconcile/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateDenomReconcileAsync(UpdateDenomReconcileRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterDenomReconcile/Update", request);
        }
        public async Task<BaseServiceResult> DeleteDenomReconcileAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterDenomReconcile/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateDenomReconcileAsync(CreateDenomReconcileRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterDenomReconcile/Create", request);
        }
        public async Task<MasterDenomReconcileListResult> GetDenomReconcileByFilterAsync(DenomReconcileFilterSearch request)
        {
            return await SendAsync<MasterDenomReconcileListResult>(HttpMethod.Post, $"api/MasterDenomReconcile/GetByFilter", request);
        }

        public async Task<MasterDenomReconcilePageResult> SearchDenomReconcileAsync(PagedRequest<MasterDenomReconcileRequest> request)
        {
            return await SendAsync<MasterDenomReconcilePageResult>(HttpMethod.Post, $"api/MasterDenomReconcile/SearchDenomReconcile", request);
        }
    }
}
