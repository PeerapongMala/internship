using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterCashtypeService
    {
        Task<IEnumerable<MasterCashType>> GetAllCashType();
        Task<MasterCashTypeViewData> GetCashTypeById(int Id);
        Task<IEnumerable<MasterCashType>> GetCashTypeByUniqueOrKey(string cashTypeCode);
        Task CreateCashType(CreateCashTypeRequest request);
        Task UpdateCashType(UpdateCashTypeRequest request);
        Task DeleteCashType(int Id);
        Task<PagedData<MasterCashType>> SearchCashType(PagedRequest<MasterCashTypeRequest> request);
    }
}
