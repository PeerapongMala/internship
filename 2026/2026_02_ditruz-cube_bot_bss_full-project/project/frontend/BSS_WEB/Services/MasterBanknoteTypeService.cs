using BSS_API.Models.RequestModels;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.MasterData;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterBanknoteTypeService : BaseApiClient, IMasterBanknoteTypeService
    {
        public MasterBanknoteTypeService(IHttpContextAccessor contextAccessor, ILogger<MasterBanknoteTypeService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterBanknoteTypeListResult> GetAllBanknoteTypeAsyn()
        {
            return await SendAsync<MasterBanknoteTypeListResult>(HttpMethod.Get, $"api/MasterBanknoteType/GetAll");
        }
        public async Task<MasterBanknoteTypeResult> GetBanknoteTypeByIdAsync(int Id)
        {

            return await SendAsync<MasterBanknoteTypeResult>(HttpMethod.Get, $"api/MasterBanknoteType/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateBanknoteTypeAsync(UpdateBanknoteTypeRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterBanknoteType/Update", request);
        }
        public async Task<BaseServiceResult> DeleteBanknoteTypeAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterBanknoteType/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateBanknoteTypeAsync(CreateBanknoteTypeRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterBanknoteType/Create", request);
        }


        public async Task<MasterBanknoteTypePageResult> SearchBanknoteTypeAsync(PagedRequest<MasterBanknoteTypeRequest> request)
        {
            return await SendAsync<MasterBanknoteTypePageResult>(HttpMethod.Post, $"api/MasterBanknoteType/SearchBanknoteType", request);
        }

       
    }
}
