using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterM7QualityService
    {
        Task<MasterM7QualityListResult> GetAllMasterM7QualityAsyn();
        Task<MasterM7QualityResult> GetM7QualityByIdAsync(int Id);
        Task<BaseServiceResult> UpdateM7QualityAsync(UpdateM7QualityRequest request);
        Task<BaseServiceResult> DeleteM7QualityAsync(int Id);
        Task<BaseServiceResult> CreateM7QualityAsync(CreateM7QualityRequest request);
        Task<MasterM7QualityPageResult> SearchM7QualityAsync(PagedRequest<MasterM7QualityRequest> request);
    }
}
