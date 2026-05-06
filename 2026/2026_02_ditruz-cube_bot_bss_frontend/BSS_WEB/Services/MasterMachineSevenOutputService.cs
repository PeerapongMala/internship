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
    public class MasterMachineSevenOutputService : BaseApiClient, IMasterMachineSevenOutputService
    {
        public MasterMachineSevenOutputService(IHttpContextAccessor contextAccessor, ILogger<MasterMachineSevenOutputService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterMachineSevenOutputListResult> GetAllMasterMachineSevenOutputAsyn()
        {
            return await SendAsync<MasterMachineSevenOutputListResult>(HttpMethod.Get, $"api/MasterMSevenOutput/GetAll");

        }
        public async Task<MasterMachineSevenOutputResult> GetMachineSevenOutputByIdAsync(int Id)
        {
            return await SendAsync<MasterMachineSevenOutputResult>(HttpMethod.Get, $"api/MasterMSevenOutput/GetById?Id={Id}");

        }
        public async Task<BaseServiceResult> UpdateMachineSevenOutputAsync(UpdateMachineSevenOutputRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterMSevenOutput/Update", request);

        }
        public async Task<BaseServiceResult> DeleteMachineSevenOutputAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterMSevenOutput/Remove?Id={Id}");

        }
        public async Task<BaseServiceResult> CreateMachineSevenOutputAsync(CreateMachineSevenOutputRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterMSevenOutput/Create", request);

        }

        public async Task<MasterMachineSevenOutputPageResult> SearchMachineSevenOutputAsync(PagedRequest<MasterMachineSevenOutputRequest> request)
        {
            return await SendAsync<MasterMachineSevenOutputPageResult>(HttpMethod.Post, $"api/MasterMSevenOutput/SearchMSevenOutput", request);
        }
    }
}
