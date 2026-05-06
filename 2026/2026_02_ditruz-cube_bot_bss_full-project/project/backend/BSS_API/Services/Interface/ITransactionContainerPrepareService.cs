using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;

namespace BSS_API.Services.Interface
{
    public interface ITransactionContainerPrepareService
    {
        Task<IEnumerable<TransactionContainerPrepare>> GetAllContainerPrepare();
        Task<TransactionContainerPrepareViewData> GetContainerPrepareById(long Id);

        Task CreateContainerPrepare(CreateTransactionContainerPrepareRequest request);
        Task UpdateContainerPrepare(UpdateTransactionContainerPrepareRequest request);
        Task DeleteContainerPrepare(long Id);
        Task<IEnumerable<TransactionContainerPrepare>> GetContainerPrepareByUniqueOrKey(string containerCode);
        Task<IEnumerable<TransactionContainerPrepareViewDisplay>> GetAllContainerPrepareAsync(int department);
        Task<TransactionContainerPrepare> GetContainerPrepareByIdAsync(long containerPrepareId);


    }
}

