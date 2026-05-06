using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterConfigService
    {
        Task<MasterConfigListResult> GetAllMasterConfigAsyn();
        Task<MasterConfigResult> GetConfigByIdAsync(int Id);
        Task<BaseServiceResult> UpdateConfigAsync(UpdateConfigRequest request);
        Task<BaseServiceResult> DeleteConfigAsync(int Id);
        Task<BaseServiceResult> CreateConfigAsync(CreateConfigRequest request);
        Task<MasterConfigListResult> GetConfigByFilterAsync(ConfigFilterSearch request);
        Task<MasterConfigResult> GetByCodeAsync(string configCode);
        Task<MasterConfigListResult> GetByConfigTypeIdAsync(int configTypeId);
        Task<DefaultConfigInfoResult> GetDefaultConfigInfoAsync();
        Task<MasterConfigListResult> GetByConfigTypeCode(string configTypeCode);
        Task<MasterConfigPageResult> SearchConfigAsync(PagedRequest<MasterConfigRequest> request);
         
     }
}
