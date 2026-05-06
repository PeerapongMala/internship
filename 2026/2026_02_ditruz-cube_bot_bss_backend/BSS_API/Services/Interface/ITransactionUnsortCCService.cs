using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;

namespace BSS_API.Services.Interface
{
    public interface ITransactionUnsortCCService
    {
        Task<IEnumerable<TransactionRegisterUnsort>> CheckValidateTransactionUnSortCcAsync(ValidateTransactionUnSortCcRequest request);

        Task<UnsortCCResponse?> GetPreparationUnsortCCById(long unsortCCId);

        Task<TransactionUnsortCC> GetExistingTransactionContainerPrepare(ExistingTransactionContainerPrepareRequest request);
    }
}
