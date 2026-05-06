namespace BSS_API.Repositories.Interface
{
    using Models.Entities;

    public interface ITransactionSendUnsortCCHistoryRepository : IGenericRepository<TransactionSendUnsortCCHistory>
    {
        Task<TransactionSendUnsortCCHistory?> GetTransactionSendUnsortCCHistoryBySendUnsortHistoryIdAsync(
            long sendUnsortHistoryId);

        Task<TransactionSendUnsortCCHistory?> GetLastTransactionSendUnsortCCHistoryBySendUnsortCCIdAsync(
            long sendUnsortCCId);

        Task<ICollection<TransactionSendUnsortCCHistory>?> GetSendUnsortCCHistoryForRegisterUnsortDeliverAsync(
            int departmentId,
            ICollection<int> statusIn,
            DateTime startDateTime, DateTime endDateTime);
    }
}