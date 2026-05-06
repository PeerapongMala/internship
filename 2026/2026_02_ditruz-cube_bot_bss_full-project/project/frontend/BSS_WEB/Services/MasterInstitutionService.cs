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
    public class MasterInstitutionService : BaseApiClient, IMasterInstitutionService
    {
        public MasterInstitutionService(IHttpContextAccessor contextAccessor, ILogger<MasterInstitutionService> logger, HttpClient client) 
            : base(client, logger, contextAccessor)
        {

        }

        public async Task<MasterInstitutionListResult> GetInstitutionsAllAsync()
        {
            return await SendAsync<MasterInstitutionListResult>(HttpMethod.Get, $"api/MasterInstitution/GetAll");
        }
        public async Task<MasterInstitutionResult> GetInstitutionByIdAsync(int id)
        {
            return await SendAsync<MasterInstitutionResult>(HttpMethod.Get, $"api/MasterInstitution/GetById?Id={id}");
        }
        public async Task<BaseServiceResult> UpdateInstitutionAsync(UpdateInstitutionRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterInstitution/Update", request);
        }
        public async Task<BaseServiceResult> CreateInstitutionAsync(CreateInstitutionRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterInstitution/Create", request);
        }
        public async Task<BaseServiceResult> DeleteInstitutionAsync(int id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterInstitution/Remove?Id={id}");
        }

        public async Task<MasterInstitutionPageResult> SearchInstitutionAsync(PagedRequest<MasterInstitutionRequest> request)
        {
            return await SendAsync<MasterInstitutionPageResult>(HttpMethod.Post, $"api/MasterInstitution/SearchInstitution", request);
        }
    }
}
