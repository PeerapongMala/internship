namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.ObjectModels;
    using Models.RequestModels;

    public interface ICbmsTransactionRepository : IGenericRepository<ReceiveCbmsDataTransaction>
    {
        public Task<IEnumerable<TransactionReceiveCbmsViewData>> GetAllReceiveCbmsDataAsync(int department);
        public Task<ReceiveCbmsDataTransaction> GetReceiveCbmsDataByIdAsync(long receiveId);

        Task<IEnumerable<TransactionReceiveCbmsViewData>> CheckReceiveCbmsTransactionAsync(
            CheckReceiveCbmsTransactionRequest request);

        Task ReceiveCbmsIncreaseRemainingQtyAsync(UpdateRemainingQtyRequest request);
        Task ReceiveCbmsReduceRemainingQtyAsync(UpdateRemainingQtyRequest request);

        Task<IEnumerable<TransactionReceiveCbmsViewData>> GetReceiveCbmsDataTransactionsWithConditionAsync(
            GetReceiveCbmsTransactionWithConditionRequest request);

        Task<IEnumerable<TransactionReceiveCbmsViewData>> ValidateCbmsDataAsync(ValidateCbmsDataRequest request);

        Task<ReceiveCbmsDataTransaction?> ValidateCbmsIsExistingAsync(string containerCode, string bnTypeInput,
            DateTime startDateTime, DateTime endDateTime);

        public Task<ReceiveCbmsDataTransaction?> GetTransactionContainerPrepareForImportCbmsIdAsync(
            string containerCode, int departmentId, int institutionId, int denominationId, DateTime startDateTime,
            DateTime endDateTime, string? barcode = null);
    }
}