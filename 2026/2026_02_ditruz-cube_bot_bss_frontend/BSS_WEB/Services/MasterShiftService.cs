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
    public class MasterShiftService : BaseApiClient, IMasterShiftService
    {
        public MasterShiftService(IHttpContextAccessor contextAccessor, ILogger<MasterShiftService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterShiftListResult> GetAllMasterShiftAsyn()
        {
            return await SendAsync<MasterShiftListResult>(HttpMethod.Get, $"api/MasterShift/GetAll");

        }
        public async Task<MasterShiftResult> GetShiftByIdAsync(int Id)
        {
            return await SendAsync<MasterShiftResult>(HttpMethod.Get, $"api/MasterShift/GetById?Id={Id}");

        }
        public async Task<BaseServiceResult> UpdateShiftAsync(UpdateShiftRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterShift/Update", request);

        }
        public async Task<BaseServiceResult> DeleteShiftAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterShift/Remove?Id={Id}");

        }
        public async Task<BaseServiceResult> CreateShiftAsync(CreateShiftRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterShift/Create", request);

        }

        public async Task<GetShiftActiveResult> GetShiftActiveAsync()
        {
            return await SendAsync<GetShiftActiveResult>(HttpMethod.Get, $"api/MasterShift/GetShiftActive");

        }

        public async Task<MasterShiftPageResult> SearchShiftAsync(PagedRequest<MasterShiftRequest> request)
        {
            return await SendAsync<MasterShiftPageResult>(HttpMethod.Post, $"api/MasterShift/SearchShift", request);
        }

        public async Task<GetCurrentShiftResult> GetCurrentShiftAsync()
        {
            return await SendAsync<GetCurrentShiftResult>(HttpMethod.Get, $"api/MasterShift/GetCurrentShift");

        }
    }
}
