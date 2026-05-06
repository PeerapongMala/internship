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
    public class MasterCompanyInstitutionService : BaseApiClient, IMasterCompanyInstitutionService
    {
        public MasterCompanyInstitutionService(IHttpContextAccessor contextAccessor, ILogger<MasterCompanyInstitutionService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {
        }
 
        public async Task<MasterCompanyInstitutionResult> GetCompanyInstitutionByIdAsync(int Id)
        {
            return await SendAsync<MasterCompanyInstitutionResult>(HttpMethod.Get, $"api/MasterCompanyInstitution/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateCompanyInstitutionAsync(UpdateCompanyInstitutionRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterCompanyInstitution/Update", request);
        }
       
        public async Task<BaseServiceResult> CreateCompanyInstitutionAsync(CreateCompanyInstitutionRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterCompanyInstitution/Create", request);
        }
        public async Task<MasterCompanyInstitutionPageResult> SearchMasterCompanyInstitutionAsync(PagedRequest<MasterCompanyInstitutionRequest> request)
        {
            return await SendAsync<MasterCompanyInstitutionPageResult>(HttpMethod.Post, $"api/MasterCompanyInstitution/SearchCompanyInstitution", request);
        }

        public async Task<BaseServiceResult> GetCbBcdCodeByInstitutionInstitution(int departmentId, int institution)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Get, $"api/MasterCompanyInstitution/GetCbBcdCodeByInstitutionInsituion?departmentId={departmentId}&institutionId={institution}" );
        }
        public async Task<BaseServiceResult> GetCbBcdCodeByCompany(int companyId)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Get, $"api/MasterCompanyInstitution/GetCbBcdCodeByCompany?companyId={companyId}");
        }


    }
}
