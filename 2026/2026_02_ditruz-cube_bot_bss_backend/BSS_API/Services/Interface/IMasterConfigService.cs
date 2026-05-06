using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterConfigService
    {
        Task<IEnumerable<MasterConfig>> GetAllConfig();
        Task CreateConfig(CreateConfigRequest request);
        Task UpdateConfig(UpdateConfigRequest request);
        Task<MasterConfigViewData> GetConfigById(int Id);
        Task<MasterConfig> GetConfigByCode(string configCode);
        Task DeleteConfig(int Id);
        Task<IEnumerable<MasterConfigViewData>> GetConfigByFilter(ConfigFilterRequest filter);
        Task<IEnumerable<MasterConfig>> GetConfigByUniqueOrKey(string configCode, int configTypeId);
        Task<IEnumerable<MasterConfig>> GetByConfigTypeId(int configTypeId);
        Task<DefaultConfigInfoData> GetDefaultConfigDataAsync();
        Task<IEnumerable<MasterConfigViewData>> GetByConfigTypeCodeAsync(string typeCode);
        Task<PagedData<MasterConfigViewData>> SearchConfig(PagedRequest<MasterConfigRequest> request);
    }
}
