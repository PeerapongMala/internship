using BSS_API.Models.RequestModels;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Services
{
    public class MasterDepartmentService : BaseApiClient, IMasterDepartmentService
    {
        public MasterDepartmentService(ILogger<MasterDepartmentService> logger, IHttpContextAccessor contextAccessor, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterDepartmentListResult> GetDepartmentsAllAsync()
        {
            return await SendAsync<MasterDepartmentListResult>(HttpMethod.Get, $"api/MasterDepartment/GetAll");
        }
        public async Task<MasterDepartmentResult> GetDepartmentsByIdAsync(int Id)
        {
            return await SendAsync<MasterDepartmentResult>(HttpMethod.Get, $"api/MasterDepartment/GetById?departmentId={Id}");
        }
        public async Task<BaseServiceResult> UpdateDepartmentAsync(UpdateDepartmentRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterDepartment/Update", request);
        }
        public async Task<BaseServiceResult> CreateDepartmentAsync(CreateDepartmentRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterDepartment/Create", request);
        }
        public async Task<BaseServiceResult> DeleteDepartmentAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterDepartment/Remove?departmentId={Id}");
        }
        public async Task<MasterDepartmentListResult> GetDepartmentByFilterAsync(DepartmentFilterSearch request)
        {
            return await SendAsync<MasterDepartmentListResult>(HttpMethod.Post, $"api/MasterDepartment/GetByFilter", request);
        }
        public async Task<MasterDepartmentListResult> GetDepartmentsActiveAsync()
        {
            return await SendAsync<MasterDepartmentListResult>(HttpMethod.Get, $"api/MasterDepartment/DepartmentsIsActive");
        }
        public async Task<MasterDepartmentPageResult> SearchMasterDepartmentAsync(PagedRequest<MasterDepartmentRequest> request)
        {
            return await SendAsync<MasterDepartmentPageResult>(HttpMethod.Post, $"api/MasterDepartment/SearchDepartment", request);
        }
    }
}
