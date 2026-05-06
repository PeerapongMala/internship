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
    public class MasterMachineService : BaseApiClient ,IMasterMachineService
    {
        public MasterMachineService(IHttpContextAccessor contextAccessor, ILogger<MasterMachineService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {

        }
        public async Task<MasterMachineListResult> GetMachineAllAsync()
        {

            return await SendAsync<MasterMachineListResult>(HttpMethod.Get, $"api/MasterMachine/GetAll");

        }
        public async Task<MasterMachineResult> GetMachineByIdAsync(int Id)
        {
            return await SendAsync<MasterMachineResult>(HttpMethod.Get, $"api/MasterMachine/GetById?Id={Id}");

        }
        public async Task<BaseServiceResult> UpdateMachineAsync(UpdateMachineRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterMachine/Update", request);

        }
        public async Task<BaseServiceResult> CreateMachineAsync(CreateMachineRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterMachine/Create", request);

        }
        public async Task<BaseServiceResult> DeleteMachineAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterMachine/Remove?Id={Id}");

        }
        public async Task<MasterMachineListResult> GetMachineByFilterAsync(MachineFilterSearch request)
        {
            return await SendAsync<MasterMachineListResult>(HttpMethod.Post, $"api/MasterMachine/GetByFilter", request);

        }
        public async Task<MachineDepartmentResult> GetMachineByDepartmentAsync(int departmentId)
        {
            return await SendAsync<MachineDepartmentResult>(HttpMethod.Get, $"api/MasterMachine/GetByDepartment?departmentId={departmentId}");

        }

        public async Task<MasterMachinePageResult> SearchMachineAsync(PagedRequest<MasterMachineRequest> request)
        {
            return await SendAsync<MasterMachinePageResult>(HttpMethod.Post, $"api/MasterMachine/SearchMachine", request);
        }
    }
}
