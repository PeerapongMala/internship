namespace BSS_API.Repositories.Interface
{
    using BSS_API.Models.ObjectModels;
    using BSS_API.Models.RequestModels;
    using Models.Entities;
    
    public interface ITransactionUserLoginLogRepository : IGenericRepository<TransactionUserLoginLog>
    {
        Task<TransactionUserLoginLog?> GetLastSupervisorLoginAsync(int department);
        Task<IEnumerable<UserLoginLogData>> GetLoginLogActiveByUserIdAsync(int userId, int departmentId);
        Task<IEnumerable<UserLoginLogData>> GetLoginLogActiveByMachineAsync(CheckUserSessionByMachineActiveRequest request);
    }
}
