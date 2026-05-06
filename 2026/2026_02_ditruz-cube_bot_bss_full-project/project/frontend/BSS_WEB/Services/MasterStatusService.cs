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
    public class MasterStatusService : BaseApiClient, IMasterStatusService
    {
        public MasterStatusService(IHttpContextAccessor contextAccessor, ILogger<MasterStatusService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }
        public async Task<MasterStatusListResult> GetStatusAllAsync()
        {
            return await SendAsync<MasterStatusListResult>(HttpMethod.Get, $"api/MasterStatus/GetAll");

           
        }
        public async Task<GetStatusByIdResult> GetStatusByIdAsync(int Id)
        {
            return await SendAsync<GetStatusByIdResult>(HttpMethod.Get, $"api/MasterStatus/GetById?Id={Id}");

        }
        public async Task<BaseServiceResult> UpdateStatusAsync(UpdateStatusRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterStatus/Update", request);

        }
        public async Task<BaseServiceResult> CreateStatusAsync(CreateStatusRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterStatus/Create", request);

        }
        public async Task<BaseServiceResult> DeleteStatusAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterStatus/Remove?Id={Id}");

        }

        public async Task<MasterStatusPageResult> SearchStatusAsync(PagedRequest<MasterStatusRequest> request)
        {
            return await SendAsync<MasterStatusPageResult>(HttpMethod.Post, $"api/MasterStatus/SearchStatus", request);
        }
    }
}
