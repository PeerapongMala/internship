namespace BSS_API.Repositories.Interface
{
    using Models.Entities;

    public interface ITransactionSendUnsortDataRepository : IGenericRepository<TransactionSendUnsortData>
    {
        Task<ICollection<TransactionSendUnsortData>?>
            GetSendUnsortDataAndRegisterUnsortAndUnsortCCWithSendUnsortCCIdAsync(long sendUnsortCCId,
                bool tracked = false);
    }
}