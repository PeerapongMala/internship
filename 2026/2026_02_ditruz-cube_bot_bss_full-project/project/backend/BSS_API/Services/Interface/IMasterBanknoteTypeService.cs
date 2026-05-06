using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.RequestModels.MasterData;

namespace BSS_API.Services.Interface
{
    public interface IMasterBanknoteTypeService
    {
        Task<IEnumerable<MasterBanknoteType>> GetAllBanknoteType();
        Task CreateBanknoteType(CreateBanknoteTypeRequest request);
        Task UpdateBanknoteType(UpdateBanknoteTypeRequest request);
        Task<MasterBanknoteType> GetBanknoteTypeById(int Id);
        Task DeleteBanknoteType(int Id);
        Task<IEnumerable<MasterBanknoteType>> GetBanknoteTypeByUniqueOrKey(string bssBanknoteTypeCode);
        Task<PagedData<MasterBankNoteTypeViewData>> SearchBankNoteType(PagedRequest<MasterBankNoteTypeRequest> request);
    }
}
