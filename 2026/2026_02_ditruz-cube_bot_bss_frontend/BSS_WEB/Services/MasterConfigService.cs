using BSS_API.Models.RequestModels;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Services
{
    public class MasterConfigService : BaseApiClient, IMasterConfigService
    {
        public MasterConfigService(IHttpContextAccessor contextAccessor, ILogger<MasterConfigService> logger, HttpClient client)
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<MasterConfigListResult> GetAllMasterConfigAsyn()
        {
            return await SendAsync<MasterConfigListResult>(HttpMethod.Get, $"api/MasterConfig/GetAll") ?? new MasterConfigListResult();
        }
        public async Task<MasterConfigResult> GetConfigByIdAsync(int Id)
        {
            return await SendAsync<MasterConfigResult>(HttpMethod.Get, $"api/MasterConfig/GetById?Id={Id}") ?? new MasterConfigResult();
        }
        public async Task<BaseServiceResult> UpdateConfigAsync(UpdateConfigRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/MasterConfig/Update", request) ?? new BaseServiceResult();
        }
        public async Task<BaseServiceResult> DeleteConfigAsync(int Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/MasterConfig/Remove?Id={Id}") ?? new BaseServiceResult();
        }
        public async Task<BaseServiceResult> CreateConfigAsync(CreateConfigRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/MasterConfig/Create", request) ?? new BaseServiceResult();
        }
        public async Task<MasterConfigListResult> GetConfigByFilterAsync(ConfigFilterSearch request)
        {
            return await SendAsync<MasterConfigListResult>(HttpMethod.Post, $"api/MasterConfig/GetByFilter", request) ?? new MasterConfigListResult();
        }

        public async Task<MasterConfigResult> GetByCodeAsync(string configCode)
        {
            return await SendAsync<MasterConfigResult>(HttpMethod.Get, $"api/MasterConfig/GetByCode?configCode={configCode}") ?? new MasterConfigResult();
        }

        public async Task<MasterConfigListResult> GetByConfigTypeIdAsync(int configTypeId)
        {
            return await SendAsync<MasterConfigListResult>(HttpMethod.Get, $"api/MasterConfig/GetByConfigTypeId?configTypeId={configTypeId}") ?? new MasterConfigListResult();
        }

        public async Task<DefaultConfigInfoResult> GetDefaultConfigInfoAsync()
        {
            return await SendAsync<DefaultConfigInfoResult>(HttpMethod.Get, $"api/MasterConfig/GetDefaultConfigInfo") ?? new DefaultConfigInfoResult();
        }
        public async Task<MasterConfigListResult> GetByConfigTypeCode(string configTypeCode)
        {
            return await SendAsync<MasterConfigListResult>(HttpMethod.Get, $"api/MasterConfig/GetByConfigTypeCode?configTypeCode={configTypeCode}") ?? new MasterConfigListResult();
        }

        public async Task<MasterConfigPageResult> SearchConfigAsync(PagedRequest<MasterConfigRequest> request)
        {
            return await SendAsync<MasterConfigPageResult>(HttpMethod.Post, $"api/MasterConfig/SearchConfig", request);
        }
    }
}
