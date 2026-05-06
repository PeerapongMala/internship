using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterConfigTypeService
    {
        Task<MasterConfigTypeListResult> GetAllMasterConfigTypeAsyn();
        Task<MasterConfigTypeResult> GetConfigTypeByIdAsync(int Id);
        Task<BaseServiceResult> UpdateConfigTypeAsync(UpdateConfigTypeRequest request);
        Task<BaseServiceResult> DeleteConfigTypeAsync(int Id);
        Task<BaseServiceResult> CreateConfigTypeAsync(CreateConfigTypeRequest request);
        Task<MasterConfigTypePageResult> SearchConfigTypeAsync(PagedRequest<MasterConfigTypeRequest> request);
    }
}
