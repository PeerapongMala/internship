using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{
    public class MasterCompanyDepartmentService : BaseApiClient, IMasterCompanyDepartmentService
    {
        public MasterCompanyDepartmentService(IHttpContextAccessor contextAccessor, ILogger<MasterCompanyDepartmentService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }
 
        public async Task<MasterCompanyDepartmentResult> GetCompanyDepartmentByIdAsync(int Id)
        {
            return await SendAsync<MasterCompanyDepartmentResult>(HttpMethod.Get, $"api/MasterCompanyDepartment/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateCompanyDepartmentAsync(UpdateCompanyDepartmentRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterCompanyDepartment/Update", request);
        }
       
        public async Task<BaseServiceResult> CreateCompanyDepartmentAsync(CreateCompanyDepartmentRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterCompanyDepartment/Create", request);
        }
        public async Task<MasterCompanyDepartmentPageResult> SearchMasterCompanyDepartmentAsync(PagedRequest<MasterCompanyDepartmentRequest> request)
        {
            return await SendAsync<MasterCompanyDepartmentPageResult>(HttpMethod.Post, $"api/MasterCompanyDepartment/SearchCompanyDepartment", request);
        }

        public async Task<BaseServiceResult> GetCbBcdCodeByDepartmentInstitution(int departmentId, int institution)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Get, $"api/MasterCompanyDepartment/GetCbBcdCodeByDepartmentInsituion?departmentId={departmentId}&institutionId={institution}" );
        }
        public async Task<BaseServiceResult> GetCbBcdCodeByCompany(int companyId)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Get, $"api/MasterCompanyDepartment/GetCbBcdCodeByCompany?companyId={companyId}");
        }


    }
}
