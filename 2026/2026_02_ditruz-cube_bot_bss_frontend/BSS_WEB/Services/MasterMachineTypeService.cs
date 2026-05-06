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
    public class MasterMachineTypeService : BaseApiClient, IMasterMachineTypeService
    {
        public MasterMachineTypeService(IHttpContextAccessor contextAccessor, ILogger<MasterMachineTypeService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }
        public async Task<MasterMachineTypeListResult> GetMachineTypeAllAsync()
        {
            return await SendAsync<MasterMachineTypeListResult>(HttpMethod.Get, $"api/MasterMachineType/GetAll");

        }
        public async Task<MasterMachineTypeResult> GetMachineTypeByIdAsync(int Id)
        {
            return await SendAsync<MasterMachineTypeResult>(HttpMethod.Get, $"api/MasterMachineType/GetById?Id={Id}");

            
        }
        public async Task<BaseServiceResult> UpdateMachineTypeAsync(UpdateMachineTypeRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterMachineType/Update", request);

        }
        public async Task<BaseServiceResult> CreateMachineTypeAsync(CreateMachineTypeRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterMachineType/Create", request);

        }
        public async Task<BaseServiceResult> DeleteMachineTypeAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterMachineType/Remove?Id={Id}");

        }

        public async Task<MasterMachineTypePageResult> SearchMachineTypeAsync(PagedRequest<MasterMachineTypeRequest> request)
        {
            return await SendAsync<MasterMachineTypePageResult>(HttpMethod.Post, $"api/MasterMachineType/SearchMachineType", request);
        }
    }
}
