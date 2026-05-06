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
    public class MasterBanknoteTypeSendService : BaseApiClient, IMasterBanknoteTypeSendService
    {
        public MasterBanknoteTypeSendService(IHttpContextAccessor contextAccessor, ILogger<MasterBanknoteTypeSendService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterBanknoteTypeSendListResult> GetAllBanknoteTypeSendAsyn()
        {
            return await SendAsync<MasterBanknoteTypeSendListResult>(HttpMethod.Get, $"api/MasterBanknoteTypeSend/GetAll");
        }
        public async Task<MasterBanknoteTypeSendResult> GetBanknoteTypeSendByIdAsync(int Id)
        {
            return await SendAsync<MasterBanknoteTypeSendResult>(HttpMethod.Get, $"api/MasterBanknoteTypeSend/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateBanknoteTypeSendAsync(UpdateBanknoteTypeSendRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterBanknoteTypeSend/Update", request);
        }
        public async Task<BaseServiceResult> DeleteBanknoteTypeSendAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterBanknoteTypeSend/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateBanknoteTypeSendAsync(CreateBanknoteTypeSendRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterBanknoteTypeSend/Create", request);
        }

        public async Task<MasterBanknoteTypeSendPagedResult> SearchBanknoteTypeSendAsync(PagedRequest<MasterBanknoteTypeSendRequest> request)
        {
            return await SendAsync<MasterBanknoteTypeSendPagedResult>(HttpMethod.Post, $"api/MasterBanknoteTypeSend/SearchBanknoteTypeSend", request);
        }

       
    }
}
