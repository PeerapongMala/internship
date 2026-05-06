using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;

namespace BSS_API.Repositories.Interface
{
    public interface IMasterBanknoteTypeSendRepository : IGenericRepository<MasterBanknoteTypeSend>
    {
        public Task<PagedData<MasterBanknoteTypeSend>> SearchBanknoteTypeSend(
           PagedRequest<MasterBanknoteTypeSendRequest> request,
           CancellationToken ct = default);
    }
}
