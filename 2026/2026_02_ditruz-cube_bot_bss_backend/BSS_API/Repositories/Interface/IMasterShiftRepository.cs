using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterShiftRepository : IGenericRepository<MasterShift>
    {
        Task<IEnumerable<ShiftInfoData>> GetShiftInfoActiveAsync();
        Task<PagedData<MasterShift>> SearchMasterShift(
           PagedRequest<MasterShiftRequest> request,
           CancellationToken ct = default);
    }
}
