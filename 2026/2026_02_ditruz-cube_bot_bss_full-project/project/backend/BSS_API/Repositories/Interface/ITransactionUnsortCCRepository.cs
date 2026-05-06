namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.RequestModels;

    public interface ITransactionUnsortCCRepository : IGenericRepository<TransactionUnsortCC>
    {
        Task<TransactionUnsortCC?> GetTransactionUnsortCCWithTransactionPrepareAsync(long unSortCcId);

        Task<IEnumerable<TransactionRegisterUnsort>> CheckValidateTransactionUnSortCcAsync(
            ValidateTransactionUnSortCcRequest request);

        public Task<TransactionUnsortCC?> GetUnsortCcTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(long receiveId, int institutionId, int denominationId, int? cashCenterId = null, string? barcode = null);
    }
}