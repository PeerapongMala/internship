namespace BSS_API.Repositories.Interface
{
    using Models.Entities;

    public interface ITransactionSourceFileRepository : IGenericRepository<TransactionSourceFile>
    {
        Task<bool> IsDuplicateFileAsync(string fileName, int machineId);
    }
}
