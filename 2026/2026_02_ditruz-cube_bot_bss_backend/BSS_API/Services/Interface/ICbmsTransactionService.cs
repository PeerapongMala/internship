namespace BSS_API.Services.Interface
{
    using Models.Entities;
    using Models.ObjectModels;
    using Models.RequestModels;
    using Models.External.Request;
    using Models.External.Response;

    public interface ICbmsTransactionService
    {
        #region ImportReceiveCbmsData

        Task<ReceiveCbmsDataResponse> ImportReceiveCbmsDataAsync(ReceiveCbmsDataRequest receiveCbmsDataRequest);

        #endregion ImportReceiveCbmsData

        Task<IEnumerable<TransactionReceiveCbmsViewData>> GetAllReceiveCbmsDataAsync(int department);
        Task UpdateReceiveCbmsData(UpdateTransactionReceiveCbmsDataRequest entity);
        Task<ReceiveCbmsDataTransaction> GetReceiveCbmsDataByIdAsync(long receiveId);
        Task DeleteReceiveCbmsData(long Id);

        Task<IEnumerable<TransactionReceiveCbmsViewData>> CheckReceiveCbmsTransactionAsync(
            CheckReceiveCbmsTransactionRequest request);

        Task ReceiveCbmsIncreaseRemainingQtyAsync(UpdateRemainingQtyRequest request);
        Task ReceiveCbmsReduceRemainingQtyAsync(UpdateRemainingQtyRequest request);

        Task<IEnumerable<TransactionReceiveCbmsViewData>> GetReceiveCbmsDataTransactionsWithConditionAsync(
            GetReceiveCbmsTransactionWithConditionRequest request);

        Task<IEnumerable<TransactionReceiveCbmsViewData>> ValidateCbmsDataAsync(ValidateCbmsDataRequest request);
    }
}