namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    
    public interface ITransactionUserLoginLogRepository : IGenericRepository<TransactionUserLoginLog>
    {
        Task<TransactionUserLoginLog?> GetLastSupervisorLoginAsync(int department);
    }
}
