using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterShiftService
    {
        Task<IEnumerable<MasterShift>> GetAllShift();
        Task<MasterShiftViewData> GetShiftById(int Id);
        Task<IEnumerable<ShiftInfoData>> GetShiftInfoActiveAsync();
        Task<IEnumerable<MasterShift>> GetShiftByUniqueOrKey(string shiftCode);
        Task CreateShift(CreateShiftRequest request);
        Task UpdateShift(UpdateShiftRequest request);
        Task DeleteShift(int Id);
        Task<PagedData<MasterShift>> SearchShift(PagedRequest<MasterShiftRequest> request);
        Task<IEnumerable<ShiftInfoData>> GetCurrentShiftAsync();
    }

}
