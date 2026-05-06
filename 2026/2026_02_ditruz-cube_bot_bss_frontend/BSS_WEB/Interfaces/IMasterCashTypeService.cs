using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterCashTypeService
    {
        Task<MasterCashTypeListResult> GetAllMasterCashTypeAsyn();
        Task<MasterCashTypeResult> GetCashTypeByIdAsync(int Id);
        Task<BaseServiceResult> UpdateCashTypeAsync(MasterCashTypeDisplay request);
        Task<BaseServiceResult> DeleteCashTypeAsync(int Id);
        Task<BaseServiceResult> CreateCashTypeAsync(MasterCashTypeDisplay request);
        Task<MasterCashTypePageResult> SearchCashTypeAsync(PagedRequest<MasterCashTypeRequest> request);
    }
} 
