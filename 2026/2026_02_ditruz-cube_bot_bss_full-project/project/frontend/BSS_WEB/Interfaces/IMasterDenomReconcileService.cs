using BSS_API.Models.RequestModels;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;

namespace BSS_WEB.Interfaces
{
    public interface IMasterDenomReconcileService
    {
        Task<MasterDenomReconcileListResult> GetAllMasterDenomReconcileAsyn();
        Task<MasterDenomReconcileResult> GetDenomReconcileByIdAsync(int Id);
        Task<BaseServiceResult> UpdateDenomReconcileAsync(UpdateDenomReconcileRequest request);
        Task<BaseServiceResult> DeleteDenomReconcileAsync(int Id);
        Task<BaseServiceResult> CreateDenomReconcileAsync(CreateDenomReconcileRequest request);
        Task<MasterDenomReconcileListResult> GetDenomReconcileByFilterAsync(DenomReconcileFilterSearch request);
        Task<MasterDenomReconcilePageResult> SearchDenomReconcileAsync(PagedRequest<MasterDenomReconcileRequest> request);
    }
}
