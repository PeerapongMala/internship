using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterDenomReconcileService
    {
        Task<IEnumerable<MasterDenomReconcile>> GetAllDenomReconcile();
        Task CreateDenomReconcile(CreateDenomReconcileRequest request);
        Task UpdateDenomReconcile(UpdateDenomReconcileRequest request);
        Task<MasterDenomReconcileViewData> GetDenomReconcileById(int Id);
        Task DeleteDenomReconcile(int Id);
        //Task<IEnumerable<MasterDenomReconcileViewData>> GetDenomReconcileByFilter(DenomReconcileFilterRequest request);
        Task<IEnumerable<MasterDenomReconcile>> GetDenomReconcileByUniqueOrKey(int denoId, int departmentId, int seriesDenomId);
        Task<PagedData<MasterDenomReconcileViewData>> SearchDenomReconcile(PagedRequest<MasterDenomReconcileRequest> request);


    }
}


