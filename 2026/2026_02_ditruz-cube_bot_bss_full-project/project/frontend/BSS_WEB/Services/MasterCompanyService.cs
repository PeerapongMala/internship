using BSS_API.Models.RequestModels;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Services
{
    public class MasterCompanyService : BaseApiClient, IMasterCompanyService
    {
        public MasterCompanyService(IHttpContextAccessor contextAccessor, ILogger<MasterCompanyService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterCompanyListResult> GetAllMasterCompanyAsyn()
        {
            return await SendAsync<MasterCompanyListResult>(HttpMethod.Get, $"api/MasterCompany/GetAll");
        }
        public async Task<MasterCompanyListResult> GetCompaniesIsActiveAsync()
        {
            return await SendAsync<MasterCompanyListResult>(HttpMethod.Get, $"api/MasterCompany/GetByIsActive");
        }
        public async Task<MasterCompanyResult> GetCompanyByIdAsync(int Id)
        {
            return await SendAsync<MasterCompanyResult>(HttpMethod.Get, $"api/MasterCompany/GetById?Id={Id}");
        }
        public async Task<BaseServiceResult> UpdateCompanyAsync(UpdateCompanyRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterCompany/Update", request);
        }
        public async Task<BaseServiceResult> DeleteCompanyAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterCompany/Remove?Id={Id}");
        }
        public async Task<BaseServiceResult> CreateCompanyAsync(CreateCompanyRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterCompany/Create", request);
        }
        public async Task<MasterCompanyPageResult> SearchMasterCompanyAsync(PagedRequest<MasterCompanyRequest> request)
        {
            return await SendAsync<MasterCompanyPageResult>(HttpMethod.Post, $"api/MasterCompany/SearchCompany", request);
        }

    }
}
