using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterBanknoteTypeRepository : IGenericRepository<MasterBanknoteType>
    { 
        public Task<PagedData<MasterBanknoteType>> SearchBanknoteType(
           PagedRequest<MasterBankNoteTypeRequest> request,
           CancellationToken ct = default);
    }
}
