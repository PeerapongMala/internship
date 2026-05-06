using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface IMasterDenominationService
    {
        Task<IEnumerable<MasterDenomination>> GetAllDenomination();
        Task<MasterDenominationViewData> GetDenominationById(int Id);
        Task<IEnumerable<MasterDenomination>> GetDenominationByUniqueOrKey(int denominationCode);
        Task CreateDenomination(CreateDenominationRequest request);
        Task UpdateDenomination(UpdateDenominationRequest request);
        Task DeleteDenomination(int Id);
        Task<PagedData<MasterDenomination>> SearchDenomination(PagedRequest<MasterDenominationRequest> request);


    }
}
